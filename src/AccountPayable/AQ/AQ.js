import React,{ useState, useCallback }  from 'react'
import { Button, Modal, ProgressBar } from "react-bootstrap";
import  "./AQ.css";
import update from '../../assets/update.svg';
import upload from '../../assets/upload.svg';
import filter from '../../assets/filter.svg';
import crop from '../../assets/crop.svg';
import { apiEndPointUrl } from "../../utils/apiService";
import { Table } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useDropzone } from 'react-dropzone';
import uploadLogo from '../../assets/uploadLogo.jpeg';
import billsLogo from '../../assets/bills.svg' 
import axios from "axios";
import Home from '../../Home/Home';
import { DisplaySettings } from '@mui/icons-material';
import { useEffect } from 'react';
import PreviewSection from './PreviewSection/PreviewSection';
import EditIcon from '@mui/icons-material/Edit';
import DeclineTable from './DeclineTable/DeclineTable';
import FilterDrawer from './FilterSection/FilterDrawer';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { roles } from '../../utils/constant';

const MAX_FILE_SIZE = 500 * 1024 * 1024;


function AQ() {

  const [pendingTable, setpendingTable] = useState(true);
  const [activeButton, setActiveButton] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(1); // State for active pagination item
  const [itemsPerPage] = useState(7);   
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [acceptHoveredIndex, setacceptHoveredIndex] = useState(null);
  const [declineHoveredIndex, setdeclineHoveredIndex] = useState(null);


  const [acceptClickIndex, setacceptClickIIndex] = useState(0);
  const [acceptStatus, setacceptStatus] = useState();
  const [declinedStatus, setdeclinedStatus] = useState('');
  const [declinedform, setdeclinedform] = useState(false);
  const [selected, setSelected] = useState(null);
  const[toBeDeclineCaseId, setToBeDeclineCaseId] = useState("")

  // invoice---
  const [invoices, setInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentInvoiceIndex, setcurrentInvoiceIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ dateRange: { from: null, to: null },
    keyword: "",
    amount: { equalTo: "", greaterThan: "", lessThan: "" },
    selectedMethods: [],
    selectedDepartments: [],});
    const [showVendorNameSearch, setShowVendorNameSearch] = useState(false);
    const [searchQueryByName, setSearchQueryByName] = useState('');
    const [selectedVendorName, setSelectedVendorName] = useState('');
    const [showCrossIcon, setShowCrossIcon] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showBillNumberSearch, setShowBillNumberSearch] = useState(false);
    const [searchQueryByBillNumber, setSearchQueryByBillNumber] = useState('');
    const [selectedVendorBillNumber, setSelectedVendorBillNumber] = useState('');
    const [showCrossBillNumber, setShowCrossBillNumber] = useState(false);
    const [showDropdownBillNumber, setShowDropdownBillNumber] = useState(false);
   const role = sessionStorage.getItem('role');
  let index="";
    // Fetch invoices from the backend
    const fetchInvoices = async (page) => {
      try {
        const currentPage="pendingInAp";
        const response = await axios.get(`${apiEndPointUrl}/get-invoices`, {
          params: { page, itemsPerPage,role,currentPage}
        });
        setInvoices(response.data);
        setFilteredData(response.data);
      } catch (error) {
        toast.error("Failed to fetch invoices", { autoClose: 1500 });
      }
    };
    useEffect(() => {
      fetchInvoices();
    }, []);


    useEffect(() => {
      // Filter data based on selected filters
      let tempData = [...invoices];
  
      // Filter by date range
      if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
        tempData = tempData.filter((invoice) =>
          new Date(invoice.receivingDate) >= new Date(filters.dateRange.from) &&
          new Date(invoice.receivingDate) <= new Date(filters.dateRange.to)
        );
      }
  
      // Filter by keyword
      if (filters.keyword) {
        tempData = tempData.filter((invoice) =>
          invoice.vendorName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        invoice.billId.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }
      if (filters.amount) {
        if (filters.amount.equalTo) {
          tempData = tempData.filter((invoice) => invoice.amount === filters.amount.equalTo);
        }
        if (filters.amount.greaterThan) {
          tempData = tempData.filter((invoice) => invoice.amount >= filters.amount.greaterThan);
        }
        if (filters.amount.lessThan) {
          tempData = tempData.filter((invoice) => invoice.amount <= filters.amount.lessThan);
        }
      }
  
      // Filter by options
      if (filters.selectedMethods.length) {
        tempData = tempData.filter((invoice) => filters.selectedMethods.includes(invoice.inboxMethod));
      }

      if (filters.selectedDepartments.length) {
        tempData = tempData.filter((invoice) => filters.selectedDepartments.includes(invoice.department));
      }
      setFilteredData(tempData);
    }, [filters, invoices]);


    //tooltip
    const handleMouseEnter = () => {
      setShowVendorNameSearch(true);  // Show search bar on hover
    };
    const handleMouseLeave = () => {
      setShowVendorNameSearch(false);  // Hide search bar when not hovered
    };
    const handleNameSearchChange = (e) => {
      setSearchQueryByName(e.target.value);
      setShowDropdown(e.target.value.length > 0);
      setShowCrossIcon(false); // Reset cross icon when typing
    };
    const handleVendorClick = (vendorName) => {
      setSelectedVendorName(vendorName);
      setSearchQueryByName(vendorName); // Set input value to selected vendor
      setShowCrossIcon(true); 
      setShowDropdown(false);
      
      const filtered = invoices.filter(invoice => invoice.vendorName.toLowerCase() === vendorName.toLowerCase());
      setFilteredData(filtered); 
        // setInvoices(filtered)
    };
    const clearSearch = () => {
      setSearchQueryByName('');
      setSelectedVendorName(''); // Clear selected vendor
      setShowCrossIcon(false); // Hide cross icon
      setShowDropdown(false);
      setFilteredData(invoices);
    };
    const filteredVendorNameInvoices = invoices.filter(invoice =>
      invoice.vendorName.toLowerCase().includes(searchQueryByName.toLowerCase())
    );
    // ------------------------toottip bill numbber---------------------
    const handleMouseEnterBill = () => {
      setShowBillNumberSearch(true);  // Show search bar on hover
    };
    const handleMouseLeaveBill = () => {
      setShowBillNumberSearch(false);  // Hide search bar when not hovered
    };
    const handleBillNumberSearch = (e) => {
      setSearchQueryByBillNumber(e.target.value);
      setShowDropdownBillNumber(e.target.value.length > 0);
      setShowCrossBillNumber(false); // Reset cross icon when typing
    };
    const handleBillNumber = (billId) => {
      setSelectedVendorBillNumber(billId);
      setSearchQueryByBillNumber(billId); // Set input value to selected vendor
      setShowCrossBillNumber(true); 
      setShowDropdownBillNumber(false);
      
      const filtered = invoices.filter(invoice => invoice.billId?.toLowerCase() === billId?.toLowerCase());
      setFilteredData(filtered); 
    };
    const clearBillNumber = () => {
      setSearchQueryByBillNumber('');
      setSelectedVendorBillNumber(''); // Clear selected vendor
      setShowCrossBillNumber(false); // Hide cross icon
      setShowDropdownBillNumber(false);
      setFilteredData(invoices);
    };
    const filteredBillNumberInvoices = invoices.filter(invoice =>
      invoice.billId.toLowerCase().includes(searchQueryByBillNumber.toLowerCase())
    );
      
    // --------------------------------preview-----------------------------------
    const handleShowPreview = (invoice, index) =>{ 
      setShowPreview(true);
      setSelectedInvoice(invoice); 
      setcurrentInvoiceIndex(index)
    }

    const handleBackPreview = () =>{ 
      if(currentInvoiceIndex>=0){
        setShowPreview(true);
        setSelectedInvoice(invoices[currentInvoiceIndex-1]);
        setcurrentInvoiceIndex(currentInvoiceIndex-1)
      }
    }

    const handleRightPreview = () =>{ 
      if(currentInvoiceIndex< invoices.length){
        setShowPreview(true);
        setSelectedInvoice(invoices[currentInvoiceIndex+1]);
        setcurrentInvoiceIndex(currentInvoiceIndex+1)
      }
    }
    
    const handleClose = () => setShowPreview(false);




// -------------------------------------handleDeclineform-------------------------------------------
    
const handleClickReason = (index) => {
  setSelected(index); // Set the clicked item as selected
};

  function handleDeclineform(index){
    setdeclinedform(true)
    setCurrentPage(1);  // Reset to the first page when showing the decline form
    setPageNumber(1); 
    setToBeDeclineCaseId(invoices[index].caseId)
    index = invoices[index]
  };


 
  function closeDeclineform(){
    setdeclinedform(false)
  };


  const DeclineButtonWithform = async ()=> {
      if(selected!==null){
        let declinedStatus = "Decline the invoice"
        try {
          const response = await axios.post(`${apiEndPointUrl}/decline`, {
            invoiceId: toBeDeclineCaseId, // Replace with the actual invoice ID field
            role:role
          });
          if(response.data.status===500 || response.data.status===400 ){
            toast.error('Sttatus is already approved/ declined !');
          }
          else{
            toast.success(`${response.data.message}`,{ autoClose: 700 });
            setdeclinedform(false);
            fetchInvoices();

          }
        } catch (error) {
          console.log('Error declinedStatus invoice:', error.message);
        }
      }
      else{
        toast.error('Slelect the reason!');
      }
  
};




// ------------accept------------
const handleAccept = async (index) => {
  setacceptStatus("Accept the invoice")
  setacceptClickIIndex(invoices[index].caseId)
      try {
        const response = await axios.post(`${apiEndPointUrl}/accept`, {
          invoiceId: invoices[index].caseId, // Replace with the actual invoice ID field
          role:role
        });

        if(response.data.status===500 || response.data.status===400 ){
          toast.error('Error in accepting invoice !');
        }
        else{
          toast.success(`${response.data.message}`, { autoClose: 1500 });
          fetchInvoices();
        }
      } catch (error) {
        console.log('Error in accepting invoice:', error.response.data.message);
        toast.error(`${error.response.data.message}`)
      }

    
};



  const handleUploadClick = () => {
    setShowModal(true);
}; 
  const handleModalClose = () => {
    setShowModal(false);
    setFile(null);
    setProgress(0);
    setUploadStatus("");
  };

  // Handling file selection via drag-and-drop or file input
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      // Handle rejected files (e.g., if file is too large)
      const { errors } = rejectedFiles[0];
      if (errors && errors[0].code === 'file-too-large') {
        toast.error("File size exceeds 10MB");
      }
    } else if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Get the first valid file
      handleFileUpload(acceptedFiles[0]); // Start upload immediately after file is selected
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE, // 10MB file size limit
    multiple: false,
    accept: 'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg',
  });

  const handleFileUpload = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await axios.post(`${apiEndPointUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (response.status === 200) {
        setProgress(100);
        setTimeout(() => {
          setUploadStatus("success");
          toast.success("File uploaded successfully!", { autoClose: 1500 });
        },3500)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("File size exceeds 500MB", { autoClose: 1500 });
        setUploadStatus("error");
      } else {
        toast.error("File upload failed", { autoClose: 1500 });
        setUploadStatus("error");
      }
    }
  };

  const handleButtonClickAll = (buttonName) => {
    setActiveButton(buttonName);
    setpendingTable(true)
  };



  const handleButtonClickDeclined = (buttonName) => {
    setActiveButton(buttonName);
    setpendingTable(false)
  };

  const data = [
    { id: 1, col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4', col5: 'Data 5', col6: 'Data 6' },
    { id: 2, col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4', col5: 'Data 5', col6: 'Data 6' },
  ];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage1 = 10; // Number of items per page
  const totalItems = 99; // Example total number of items (coins)

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    setCurrentPage(value);
    // Fetch or update your data for the new page here
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div style={{display:"flex"}}>
    <Home currentPage="invoiceQueue" />
    <div className='AQTab'>
      <div className='AQNavbar'>
            <h4 className='AQHeading'>  Approval Queue </h4>

            <div className='AQNavbarSideButtons'> 
              <button className='AQNavbarUpdateButton'>  <img src={update} /> Update</button>
              <button className='AQNavbarUploadButton' onClick={handleUploadClick}><img src={upload}/>Upload Bill</button>
            </div>
      </div>


     <div className='AQBelowHeading'>
        <div className='AQAcceptAndDecline'>
          <button className={`AQAllDiv ${activeButton === 'all' ? 'active' : ''}`}
            onClick={() => handleButtonClickAll('all')}>
            <div className='insideAQAllDiv'>
                 <img src={crop} style={{ width: "0.9em", height: "2em" , color:"black"}} /> <span>All</span>
            </div>

             <p>21</p>
          </button>

          <button className={`AQDeclineDiv ${activeButton === 'declined' ? 'active' : ''}`}
            onClick={() => handleButtonClickDeclined('declined')}>
            <div className='insideAQDeclineDiv '>
                 <img src={crop} style={{ width:"0.9em", height: "2em" }} /> <span>Declined</span>
            </div>

             <p>21</p>
          </button>
        </div>

         {/* <button className='AQfilter'>
             
         </button> */}
         <FilterDrawer onApplyFilters={setFilters} />


     </div>

      {
          declinedform === false && activeButton === "all" && pendingTable 
                                          ? 
            <div className="mt-4 d-flex flex-column align-items-center outerTableDiv">
              <Table className="custom-width">
                <thead>
                  <tr>
                  <th  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ondata-toggle="tooltip" data-placement="bottom" >
                    <input type="checkbox"  />
                      &nbsp;&nbsp;&nbsp;Vendor Name
                      {
                               showVendorNameSearch 
                                       && 
                      <div className="vendorNameTooltip">
                        <div className="vendorNameSearchDiv">
                          <input id="vendorNameSearch"  type="text"  className="form-control" placeholder={selectedVendorName || "Search Vendor"} // Update placeholder
                              value={searchQueryByName} onChange={handleNameSearchChange}/>
                          {
                            showCrossIcon 
                                   ? 
                              <CloseIcon
                                style={{  fontSize: '19px',  position: 'absolute', top: '12px',left: '79%', color: 'black', cursor: 'pointer', }}  onClick={clearSearch}/>
                                  : 
                              <SearchIcon
                                style={{ fontSize: '19px', position: 'absolute', top: '12px', left: '79%',color: 'black', }}/>
                            }
                          {
                             showDropdown && searchQueryByName
                                       ? 
                              filteredVendorNameInvoices.length > 0 
                                          ? 
                              filteredVendorNameInvoices.map((invoice) => (
                                <div key={invoice.id} className="invoiceCard"  onClick={() => handleVendorClick(invoice.vendorName)} >
                                  <div className="vendorName" id='filterTooltip'>{invoice.vendorName}</div>
                                </div>
                              ))
                                              : 
                            <div className="noResults"  id='filterTooltip'> No matching invoices found</div>
                                                   : 
                                                ""
                          }
                        </div>
                      </div>
                    }
                    </th>
                    <th  onMouseEnter={handleMouseEnterBill} onMouseLeave={handleMouseLeaveBill} ondata-toggle="tooltip" data-placement="bottom" >
                      Bill Number
                     {
                               showBillNumberSearch 
                                       && 
                      <div className="vendorNameTooltip" id='billNumberAQTool'>
                        <div className="vendorNameSearchDiv">
                          <input id="vendorNameSearch"  type="text"  className="form-control" placeholder={selectedVendorBillNumber || "Search Bill"} // Update placeholder
                              value={searchQueryByBillNumber} onChange={handleBillNumberSearch}/>
                          {
                            showCrossBillNumber 
                                   ? 
                              <CloseIcon
                                style={{  fontSize: '19px',  position: 'absolute', top: '12px',left: '79%', color: 'black', cursor: 'pointer', }}  onClick={clearBillNumber}/>
                                  : 
                              <SearchIcon
                                style={{ fontSize: '19px', position: 'absolute', top: '12px', left: '79%',color: 'black', }}/>
                            }
                          {
                             showDropdownBillNumber && searchQueryByBillNumber
                                       ? 
                              filteredBillNumberInvoices.length > 0 
                                          ? 
                              filteredBillNumberInvoices.map((invoice) => (
                                <div key={invoice.id} className="invoiceCard"  onClick={() => handleBillNumber(invoice.billId)} >
                                  <div className="vendorName" id='filterTooltip'>{invoice.billId}</div>
                                </div>
                              ))
                                              : 
                            <div className="noResults"  id='filterTooltip'>No matching invoices found</div>
                                                   : 
                                                ""
                          }
                        </div>
                      </div>
                    }
                    </th>
                    <th>Bill Date</th>
                    <th>Inbox Method</th>
                    <th>Amount</th>
                    {role === roles.apPerson?  <th>Actions</th>:null}
                  </tr>
                </thead>
                <tbody>
                    {
                      currentItems.map((invoice, index) => (
                        <tr key={invoice.billId}>
                          <td onClick={() => handleShowPreview(invoice, index)}>
                            <input type="checkbox" />{" "}
                            <img
                              src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                              alt="Vendor Avatar"
                            />
                            &nbsp;&nbsp;&nbsp;{invoice.vendorName}
                          </td>
                          <td onClick={() => handleShowPreview(invoice, index)}>  {invoice.billId}</td>
                          <td onClick={() => handleShowPreview(invoice, index)}>{new Date(invoice.receivingDate).toLocaleDateString()} </td>
                          <td onClick={() => handleShowPreview(invoice, index)}> {invoice.inboxMethod}</td>
                          <td onClick={() => handleShowPreview(invoice, index)}> {invoice.amount}</td>
                          {role === roles.apPerson?  <td id="actionOfAQ">
                            <>
                              <span className="actionOfAQ"  id="actionOfAQAccept" onClick={() => handleAccept(index)} onMouseEnter={() => setacceptHoveredIndex(index)}
                                onMouseLeave={() => setacceptHoveredIndex(null)}>
                                {acceptHoveredIndex === index ? "✓ Accept" : "✓"}
                              </span>
                              <span className="actionOfAQ" id="actionOfAQDecline" onClick={() => handleDeclineform(index)}  onMouseEnter={() => setdeclineHoveredIndex(index)}
                                onMouseLeave={() => setdeclineHoveredIndex(null)} >
                                {declineHoveredIndex === index ? "× Decline" : "✕"}
                              </span>
                            </>
                          </td>:null}
                        
                        </tr>
                      ))
                    }
                </tbody>
              </Table>
            </div>
                                         : 
            declinedform === true && activeButton === "all" && pendingTable 
                                          ? 
            <div className="mt-4 d-flex align-items-center outerTableDiv" id="declineWithTableOfAQ">
              <Table className="custom-width">
                <thead>
                  <tr>
                    <th> <input type="checkbox" /> &nbsp;&nbsp;&nbsp;Vendor Name </th>
                    <th  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ondata-toggle="tooltip" data-placement="bottom" >
                      <input type="checkbox"  />
                      &nbsp;&nbsp;&nbsp;Vendor Name
                     {
                               showVendorNameSearch 
                                       && 
                      <div className="vendorNameTooltip" style={{ width: '12%'}}> 
                        <div className="vendorNameSearchDiv">
                          <input id="vendorNameSearch"  type="text"  className="form-control" placeholder={selectedVendorName || "Search Vendor"} // Update placeholder
                              value={searchQueryByName} onChange={handleNameSearchChange}/>
                          {
                            showCrossIcon 
                                   ? 
                              <CloseIcon
                                style={{  fontSize: '19px',  position: 'absolute', top: '12px',left: '79%', color: 'black', cursor: 'pointer', }}  onClick={clearSearch}/>
                                  : 
                              <SearchIcon
                                style={{ fontSize: '19px', position: 'absolute', top: '12px', left: '79%',color: 'black', }}/>
                            }
                          {
                             showDropdown && searchQueryByName
                                       ? 
                              filteredVendorNameInvoices.length > 0 
                                          ? 
                              filteredVendorNameInvoices.map((invoice) => (
                                <div key={invoice.id} className="invoiceCard"  onClick={() => handleVendorClick(invoice.vendorName)} >
                                  <div className="vendorName" id='filterTooltip'>{invoice.vendorName}</div>
                                </div>
                              ))
                                              : 
                            <div className="noResults"  id='filterTooltip'>No matching invoices found</div>
                                                   : 
                                                ""
                          }
                        </div>
                      </div>
                    }
                    </th>
                    <th  onMouseEnter={handleMouseEnterBill} onMouseLeave={handleMouseLeaveBill} ondata-toggle="tooltip" data-placement="bottom" >
                      Bill Number
                     {
                               showBillNumberSearch 
                                       && 
                      <div className="vendorNameTooltip"  style={{ width: '9%'}}>
                        <div className="vendorNameSearchDiv">
                          <input id="vendorNameSearch"  type="text"  className="form-control" placeholder={selectedVendorBillNumber || "Search Bill"} // Update placeholder
                              value={searchQueryByBillNumber} onChange={handleBillNumberSearch}/>
                          {
                            showCrossBillNumber 
                                   ? 
                              <CloseIcon
                                style={{  fontSize: '19px',  position: 'absolute', top: '12px',left: '79%', color: 'black', cursor: 'pointer', }}  onClick={clearBillNumber}/>
                                  : 
                              <SearchIcon
                                style={{ fontSize: '19px', position: 'absolute', top: '12px', left: '79%',color: 'black', }}/>
                            }
                          {
                             showDropdownBillNumber && searchQueryByBillNumber
                                       ? 
                              filteredBillNumberInvoices.length > 0 
                                          ? 
                              filteredBillNumberInvoices.map((invoice) => (
                                <div key={invoice.id} className="invoiceCard"  onClick={() => handleBillNumber(invoice.billId)} >
                                  <div className="vendorName" id='filterTooltip'>{invoice.billId}</div>
                                </div>
                              ))
                                              : 
                            <div className="noResults">No matching invoices found</div>
                                                   : 
                                                ""
                          }
                        </div>
                      </div>
                    }
                    </th>                    <th>Bill Date</th>
                    <th>Inbox Method</th>
                    <th>Amount</th>
                    ${role === roles.apPerson ?  <th>Actions</th>:null}
                  </tr>
                </thead>
                <tbody>
                  {
                    currentItems.map((invoice, index) => (
                      <tr key={invoice.billId}>
                        <td>
                          <input type="checkbox" />{" "}
                          <img
                            src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                            alt="Vendor Avatar"
                          />
                          &nbsp;&nbsp;&nbsp;{invoice.vendorName}
                        </td>
                        <td onClick={() => handleShowPreview(invoice, index)}>  {invoice.billId}</td>
                        <td>{new Date(invoice.receivingDate).toLocaleDateString()}</td>
                        <td>{invoice.inboxMethod}</td>
                        <td>{invoice.amount}</td>
                        {role === roles.approver1? <td id="actionOfAQWithDeclineform">
                          <>
                            <span
                              className="actionOfAQWithDeclineform" id="actionOfAQAcceptWithDeclineform" onClick={() => handleAccept(index)}  onMouseEnter={() => setacceptHoveredIndex(index)}
                              onMouseLeave={() => setacceptHoveredIndex(null)}
                            >
                              {acceptHoveredIndex === index ? "✓ Accept" : "✓"}
                            </span>
                            <span className="actionOfAQWithDeclineform"  id="actionOfAQDeclineWithDeclineform"    onClick={() => handleDeclineform(index)}  onMouseEnter={() => setdeclineHoveredIndex(index)}
                              onMouseLeave={() => setdeclineHoveredIndex(null)}
                            >
                              {declineHoveredIndex === index ? "× Decline" : "✕"}
                            </span>
                          </>
                        </td>:null}
                      </tr>
                    ))
                  }
                </tbody>
              </Table>

              <div className="RightDivOfAQDeclineform" style={{ marginLeft: "1.5rem", width: "30%" }}>
                <nav className="AQDeclineformCrossOnTable">
                  <button className="formCloseButtonOnTable" onClick={closeDeclineform}> Decline Feedback </button>
                </nav>

                <div className="reasonOfDeclineDivOnTable">
                  <p className={`reasonOfDeclineOnTable ${selected === 0 ? "selected" : ""}`} onClick={() => handleClickReason(0)} >
                    <EditIcon style={{ fontSize: "12px" }} /> Incorrect data
                  </p>
                  <p className={`reasonOfDeclineOnTable ${selected === 1 ? "selected" : ""}`} onClick={() => handleClickReason(1)}
                  >
                    <EditIcon style={{ fontSize: "12px" }} /> Missing Invoice
                  </p>
                  <p className={`reasonOfDeclineOnTable ${selected === 2 ? "selected" : ""}`}  onClick={() => handleClickReason(2)}
                  >
                    <EditIcon style={{ fontSize: "12px" }} /> Duplicate Invoice
                  </p>
                  <p className={`reasonOfDeclineOnTable ${selected === 3 ? "selected" : ""}`}  onClick={() => handleClickReason(3)}
                  >
                    <EditIcon style={{ fontSize: "12px" }} /> Calculation Error
                  </p>
                  <p className={`reasonOfDeclineOnTable ${selected === 4 ? "selected" : ""}`} onClick={() => handleClickReason(4)}
                  >
                    <EditIcon style={{ fontSize: "12px" }} /> Other
                  </p>
                  <button className="DeclineButtonOnTable" onClick={DeclineButtonWithform}> Decline </button>
                </div>
              </div>
            </div>
                       : 
                      
                <DeclineTable filters={filters} currentPage={currentPage}
          itemsPerPage={itemsPerPage} />
        
        }



      <div className="pagination-div">
        <div className='pagination-insideDiv'>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
          </div>
      </div>


      <Modal
          show={showModal}
          onHide={handleModalClose}
          size="lg"
          style={{ marginTop: '2%', width: '70%', marginLeft: '19%' }}
          scrollable
          dialogClassName="modal-90w"
  
          
        >
          <Modal.Header closeButton >
          <Modal.Title>Upload Invoice</Modal.Title>
  
          </Modal.Header>
          <Modal.Body>
          
            <div
              {...getRootProps()}
              style={{
                border: '1.5px dashed #7939EF',
                padding: '50px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f3f3f3' : 'white',
                width:"93%",
                marginLeft:"3%",
                 borderRadius:'12.23px'
              }}
            >
            <img src={uploadLogo} style={{ height:"100px", width:"100px" }}/>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <p>Drag and drop your file here or <span style={{ color: 'blue', textDecoration: 'underline' }}>Browse file</span></p>
              )}
            </div>
            <div style={{marginTop:"2%",display:"flex", flexDirection:"row", justifyContent:"space-between",width: '94%', marginLeft:"3%"}}>            
              <p>Supported formats: PDF, DOC, XLSX & JPEG.</p>
              <p>Max file size: 500MB</p>
            </div>
            {file && (
              <div style={{display:"flex",marginTop: '20px', border: `2px solid ${uploadStatus === 'success' ? '#208348' : '#7939EF'}`, borderRadius:"12.23px",padding:"2%" ,width: '94%', marginLeft:"3%"}}>
                <img src={billsLogo} style={{height:"24.46px", width:"24.46px", margin:"3% 1.5% 1.5% 1%"}}/>
                <div>
                <p style={{ font:"Inter, sans-serif", color:"#141414", fontWeight:"500", fontSize:'14.67px'}} >{file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)</p>
                
                <ProgressBar
                  now={progress}
                  label={`${progress}%`}
                  variant={uploadStatus === 'error' ? 'danger' : progress === 100 ? 'success' : ''}
                  style={{ height: '11px', width:"500px", font:"Inter,, sans-serif", color:"#141414", fontWeight:"500"}} 
                   
                />
                                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
        <ToastContainer />
        </div>



        {/* -----------preview section---------- */}
        <Modal show={showPreview} onHide={handleClose} centered size="xl" style={{borderRadius:"24px"}}>
            {/* <Modal.Header closeButton>
            </Modal.Header> */}
            <Modal.Body style={{paddingTop:"0%", paddingRight:"0%",paddingLeft:"0%",paddingBottom:"0%"
            }}>
              
              <PreviewSection invoice={selectedInvoice} />
            </Modal.Body>
           
            <Button
              className="arrow-btn left-arrow"
              variant="outline-primary"
              onClick={handleBackPreview}
              disabled={currentInvoiceIndex <=0}
            >
               <span className="large-arrow">&#8249;</span> {/* Left arrow icon */}
            </Button>

            {/* Right arrow button */}
            <Button
              className="arrow-btn right-arrow"
              variant="outline-primary"
              onClick={handleRightPreview}
              disabled={currentInvoiceIndex >= invoices.length-1}
            >
              &#8250; {/* Right arrow icon */}
            </Button>
      </Modal>
    </div>




  )
}

export default AQ