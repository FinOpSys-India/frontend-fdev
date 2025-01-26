import React, { useState } from 'react'
import Home from '../../../Home/Home'
import upload from '../../../assets/upload.svg'
import rightButton from '../../../assets/rightButton.svg'
import activityLog from '../../../assets/activityLog.svg';
import acitivityPointButton from '../../../assets/acitivityPointButton.svg'
import leftButton from '../../../assets/leftButton.svg'
import crossButton from '../../../assets/crossButton.svg'
import dropButton from '../../../assets/dropButton.svg'
import upButton from '../../../assets/upButton.svg'
import SearchIcon from '@mui/icons-material/Search';
import FilterDrawer from '../../AQ/FilterSection/FilterDrawer'
import { apiEndPointUrl } from "../../../utils/apiService";
import { Pagination, Table } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";  
import axios from "axios";
import { useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import  "./ApprovedBills.css";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import chat from '../../../assets/chat.svg';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Chat from '../../Chat/Chat';
import { Button, Modal, ProgressBar } from "react-bootstrap";
import PreviewSection from '../../AQ/PreviewSection/PreviewSection';
import { roles } from '../../../utils/constant';
import ActvityLog from '../../AQ/ActvityLog/ActvityLog';


function ApprovedBills() {

  const [filters, setFilters] = useState({ dateRange: { from: null, to: null },
    keyword: "",
    amount: { equalTo: "", greaterThan: "", lessThan: "" },
    selectedMethods: [],
    selectedDepartments: [],});

    const [itemsPerPage] = useState(7);  
    const [showPreview, setShowPreview] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [vendorId,setVendorId] = useState('');
    const [currentInvoiceIndex, setcurrentInvoiceIndex] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState('Approved Bills');
    const [activeButton, setActiveButton] = useState(null);
    const navigate = useNavigate();
    const [showacitivityLog, setShowAcitivityLog] = useState(false);
    const [showSideSection, setShowSideSection] = useState(false);
    const [showChatSection, setShowChatSection] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
     const [caseId,setCaseId] = useState("");
     const [ActvityLogInvoice,setActvityLogInvoice] = useState("");
     const [ActvityLogCaseId,setActvityLogCaseId] = useState("");
      const [pageNumber, setPageNumber] = useState(1);
    const role = sessionStorage.getItem('role');

     let index="";


    //  -------------- dropdown-------------
    const handleSelect = (eventKey) => {
      setSelectedItem(eventKey);
    };

    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName === activeButton ? null : buttonName);
      navigate(`/${buttonName}`); // Navigates to the path based on button name
    };

    //------------------------- Fetch invoices from the backend-------------------
    const fetchInvoices = async (page) => {
      try {
        const currentPage= "approved"
        const response = await axios.get(`${apiEndPointUrl}/get-invoices`, {
          params: { page, itemsPerPage,role, currentPage }
        });
        setInvoices(response.data);
        setFilteredData(response.data);
        // setTotalInvoices(response.headers['x-total-count']); // Assuming your API sends the total count in the header
      } catch (error) {
        toast.error("Failed to fetch invoices", { autoClose: 1500 });
      }
    };
  
    useEffect(() => {
      fetchInvoices();
    }, []);

    const closeChat = () => {
      setShowChatSection(false);
      setShowSideSection(false); // Close the chat
      setCaseId(null); // Clear the active caseId
    };  
  


    // --------------------------------preview-----------------------------------
    const handleShowPreview = (invoice, index) =>{ 
      setShowPreview(true);
      setSelectedInvoice(invoice.caseId);
      setVendorId(invoice.vendorId); 
      setcurrentInvoiceIndex(index);
    }
    const expandInChat = (invoice)=>{
      setShowPreview(true);
      setSelectedInvoice(invoice); 
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

 // --------------------acitivityLogSection--------------------------------
 const openModal = () => setIsModalOpen(true);

 
   function acitivityLogSection(newIvoice){
    console.log("cha",newIvoice )
    console.log("cha",newIvoice.caseId )
    setActvityLogCaseId(newIvoice.caseId)
    // if (caseId !== newIvoice.caseId) {
     setActvityLogInvoice(newIvoice);
      setShowSideSection(true);
      setShowAcitivityLog(true)
    // }
  }


  function acitivityLogClose(){
    console.log("Closing activity log...");
    setShowSideSection(false);
    setShowAcitivityLog(false);
    setActvityLogInvoice(null);
}

   function openDetailButton(){
    setOpenDetail(true);
   }

   function closeDetailButton(){
    setOpenDetail(false);
   }




   function chatLogSection(newCaseId){
    if (caseId !== newCaseId) {
      setActiveButton(newCaseId); // Update the active chat caseId
      setShowSideSection(true);
      setShowChatSection(true); // Open the chat section
    }
   }

   

   //---------------------filter data based on selected filters------------------------------
    
   useEffect(() => {
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




  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setPageNumber(value);
  };


//------------ Calculate pagination----------------
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems)

  // Calculate total pages
 const totalPages = Math.ceil(invoices.length/itemsPerPage);







  
  return (
      <div style={{display:"flex"}}>
          <Home currentPage="billAQButton" />
           
          <div className='AQTab'>
              <div className='AQNavbar'>
                
                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle  id="" className="BillDropDown">
                     <p>{selectedItem} <ArrowDropDownIcon/></p> 
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='billDropdownItem'>
                       <Dropdown.Item className='billDropdownEachItem'  eventKey="Pending Bills" onClick={() => handleButtonClick('billAQButton')}>Pending Bills</Dropdown.Item>  
                      <Dropdown.Item className='billDropdownEachItem'  eventKey="Decline Bills" onClick={() => handleButtonClick('decline-Bills')}>Decline Bills</Dropdown.Item>
                      {(role != roles.approver1 && role !==roles.approver2)?<Dropdown.Item className='billDropdownEachItem'  eventKey="All Bills" onClick={() => handleButtonClick('all-Bills')}>All Bills</Dropdown.Item>:null}
                       
                    </Dropdown.Menu>
                  </Dropdown>

                <div className='BillNavbarSideButtons'> 
                    <div className='BillSearchBar'>
                      <SearchIcon style={{ fontSize: '19px', position: 'absolute', top: '33px', left: '83%',color: 'black', }}/>    
                      <input id="BillNameSearch"  type="text"  className="form-control" placeholder="Search"/>
                    </div> 
                    <button className='BillNavbarExportButton'>Export</button>
                </div>
              </div>

              <div className='filterBillDiv'>
                  <div className=''>
                    {"bill"}
                  </div>

                    <FilterDrawer onApplyFilters={setFilters} />
              </div>

              {
                 showSideSection!== true
                           ?
                  <div className="mt-3 d-flex flex-column align-items-center outerTableDiv approvedBillTable">
                    <Table className="custom-width">
                      <thead>
                        <tr>
                        <th> <input type="checkbox"  />   &nbsp;&nbsp;&nbsp;Bill Number   </th>
                          <th>Vendor Name</th> 
                          <th>Bill Date</th>
                          <th>Approved Date</th>
                          <th>Amount</th>
                          <th>Actions</th>
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
                                  &nbsp;&nbsp;&nbsp;{invoice.billId}
                                </td>
                                <td onClick={() => handleShowPreview(invoice, index)}>  {invoice.vendorName}</td>
                                <td onClick={() => handleShowPreview(invoice, index)}>{new Date(invoice.receivingDate).toLocaleDateString()} </td>
                                <td onClick={() => handleShowPreview(invoice, index)}> 11/09/2024 </td>
                                <td onClick={() => handleShowPreview(invoice, index)}> {invoice.amount}</td>
                                 <td id="" > {role !== roles.approver1 ?<img  onClick={() => acitivityLogSection(invoice)} src={activityLog}/>:null} &nbsp;
                                <img src={chat} onClick={() => chatLogSection(invoice.caseId)}  />
                                </td>
                              </tr>
                            ))
                          }
                      </tbody>
                    </Table>
                  </div>
                       :
                  <div className="approvedTableWithAcitivityLog" >
                     <div className="mt-3 d-flex flex-column align-items-center" id='acityLogTable'>
                        <Table className="custom-width" style={{marginTop:"-1%"}}>
                          <thead >
                            <tr>
                            <th> <input type="checkbox"  />   &nbsp;&nbsp;&nbsp;Bill Number   </th>
                              <th>Vendor Name</th> 
                              <th>Bill Date</th>
                              <th>Department</th>
                              <th>Amount</th>
                              <th>Actions</th>
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
                                      &nbsp;&nbsp;&nbsp;{invoice.billId}
                                    </td>
                                    <td onClick={() => handleShowPreview(invoice, index)}>  {invoice.vendorName}</td>
                                    <td onClick={() => handleShowPreview(invoice, index)}>{new Date(invoice.receivingDate).toLocaleDateString()} </td>
                                    <td onClick={() => handleShowPreview(invoice, index)}> {invoice?.approvedBillDate} </td>
                                    <td onClick={() => handleShowPreview(invoice, index)}> {invoice.amount}</td>
                                    <td id="" > {role !== roles.approver1 ?<img onClick={() => acitivityLogSection(invoice)} src={activityLog}/>:null} &nbsp;
                                    <img src={chat} onClick={() => chatLogSection(invoice.caseId)}  />
                                    </td>
                                  </tr>
                                ))
                              }
                          </tbody>
                        </Table>
                      </div>

                      {showacitivityLog 
                              ? 
                          <ActvityLog  ActvityLogInvoice={ActvityLogInvoice}   ActvityLogCaseId={ActvityLogCaseId} acitivityLogClose={acitivityLogClose}/>
                          :
                          null
                      }
                      {showChatSection?
                        <Chat caseId={caseId} fetchInvoices={fetchInvoices} closeChat={closeChat} notDisabledChat={role===roles.approver1 ? "true":"false"} expandInChat = {expandInChat}/>
                      :null}
                  </div>  
              }  
        </div>

        

        {/* -----------preview section---------- */}
        <Modal show={showPreview} onHide={handleClose} centered size="xl" style={{borderRadius:"24px"}}>
            {/* <Modal.Header closeButton>
            </Modal.Header> */}
            <Modal.Body style={{paddingTop:"0%", paddingRight:"0%",paddingLeft:"0%",paddingBottom:"0%"
            }}>
              
              <PreviewSection invoiceId={selectedInvoice} setShowPreview = {setShowPreview} fetchInvoices = {fetchInvoices} showAcceptDeclineButtons={false} vendorId={vendorId}/>
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
    
      {/* <div className="pagination-div">
          <div className='pagination-insideDiv'>
              <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
              />
          </div>
      </div> */}
    </div>
  )
}

export default ApprovedBills