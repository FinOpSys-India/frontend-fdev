import React, { useState } from 'react'
import Home from '../../../Home/Home'
import upload from '../../../assets/upload.svg';
import SearchIcon from '@mui/icons-material/Search';
import FilterDrawer from '../../AQ/FilterSection/FilterDrawer'
import { apiEndPointUrl } from "../../../utils/apiService";
import { Table } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";  
import axios from "axios";
import { useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import  "./AllBills.css";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { invoiceStatus } from '../../../utils/constant';
import chat from '../../../assets/chat.svg';
import Chat from '../../Chat/Chat';
import activityLog from '../../../assets/activityLog.svg';
import acitivityPointButton from '../../../assets/acitivityPointButton.svg'
import leftButton from '../../../assets/leftButton.svg'
import crossButton from '../../../assets/crossButton.svg'
import dropButton from '../../../assets/dropButton.svg'
import rightButton from '../../../assets/rightButton.svg'
import { Button, Modal, ProgressBar } from "react-bootstrap";
import upButton from '../../../assets/upButton.svg'
import PreviewSection from '../../AQ/PreviewSection/PreviewSection';




function AllBills() {

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
    const [selectedInvoice, setSelectedInvoice] = useState([]);
    const [vendorId,setVendorId] = useState('');
    const [currentInvoiceIndex, setcurrentInvoiceIndex] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState('All Bills');
    const [activeButton, setActiveButton] = useState(null);
    const role = sessionStorage.getItem('role');
    const [caseId,setCaseId] = useState("");
    const [showacitivityLog, setShowAcitivityLog] = useState(false);
        const [showSideSection, setShowSideSection] = useState(false);
        const [showChatSection, setShowChatSection] = useState(false);
            const [openDetail, setOpenDetail] = useState(false);
            const [isModalOpen, setIsModalOpen] = useState(false);
        
    const navigate = useNavigate();

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
        const currentPage="all"
        const response = await axios.get(`${apiEndPointUrl}/get-invoices`, {
          params: { page, itemsPerPage,role,currentPage}
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
    
  
    // --------------------------------preview-----------------------------------
    const handleShowPreview = (invoice, index) =>{ 
      setShowPreview(true);
      setSelectedInvoice(invoice.caseId); 
      setVendorId(invoice.vendorId);
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

  

    function acitivityLogSection(){
      setShowSideSection(true);
      setShowAcitivityLog(true)
    }
    const openModal = () => setIsModalOpen(true);

  
     function acitivityLogClose(){
      setShowSideSection(false);
      setShowAcitivityLog(false);
     }
  
     function openDetailButton(){
      setOpenDetail(true);
     }
  
     function closeDetailButton(){
      setOpenDetail(false);
     }
    const closeChat = () => {
      setShowChatSection(false);
      setShowSideSection(false); // Close the chat
      setCaseId(null); // Clear the active caseId
    }; 
    function chatLogSection(newCaseId){
      if (caseId !== newCaseId) {
        setCaseId(newCaseId); // Update the active chat caseId
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



  // -----------------------------Calculate pagination-------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage1 = 10; 
  const totalItems = 99;

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    setCurrentPage(value);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);


  
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
                      <Dropdown.Item className='billDropdownEachItem'  eventKey="Approved Bills" onClick={() => handleButtonClick('approved-Bills')}>Approved Bills</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                <div className='BillNavbarSideButtons'> 
                    <div className='BillSearchBar'>
                      <SearchIcon style={{ fontSize: '19px', position: 'absolute', top: '33px', left: '83%',color: 'black', }}/>    
                      <input id="BillNameSearch"  type="text"  className="form-control" placeholder="Search"/>
                    </div> 
                    <button className='BillNavbarExportButton'> <img src={upload}/>Export</button>
                </div>
              </div>

              <div className='filterBillDiv'>
                  <div className=''>
                    Bill No.
                  </div>

                    <FilterDrawer onApplyFilters={setFilters} />
              </div>
              <div className={showSideSection?"allTableWithSideSection":""} >
                <div className="mt-4 d-flex flex-column align-items-center outerTableDiv" id={showSideSection?"allTableInSideSection":""}>
                  <Table className="custom-width">
                    <thead>
                      <tr>
                        <th> <input type="checkbox"  />   &nbsp;&nbsp;&nbsp;Vendor Name </th>
                        <th>Bill Number</th>
                        <th>Bill Date</th>
                        <th>Status</th>
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
                                &nbsp;&nbsp;&nbsp;{invoice.vendorName}
                              </td>
                              <td onClick={() => handleShowPreview(invoice, index)}>  {invoice.billId}</td>
                              <td onClick={() => handleShowPreview(invoice, index)}>{new Date(invoice.receivingDate).toLocaleDateString()} </td>
                              <td onClick={() => handleShowPreview(invoice, index)}>
                              <span
                                  className={`status-badge ${
                                    invoice.status === invoiceStatus.declineByApprover1 ||
                                    invoice.status === invoiceStatus.declineByApprove2
                                      ? "declined"
                                      : invoice.status === invoiceStatus.approvedByApprover1 ||
                                        invoice.status === invoiceStatus.acceptedByAp
                                      ? "pending"
                                      : "approved"
                                  }`}
                                >
                              <span className="status-dot"></span>
                                {invoice.status== invoiceStatus.declineByApprover1 ||invoice.status== invoiceStatus.declineByApprove2 ? "Decline"
                              :invoice.status== invoiceStatus.approvedByApprover1 ||invoice.status== invoiceStatus.acceptedByAp?"Pending":"Approved"}
                              </span>
                              </td>
                              
                              <td onClick={() => handleShowPreview(invoice, index)}> {invoice.amount}</td>
                              <td id="">
                              <img onClick={acitivityLogSection} src={activityLog}/> &nbsp;
                              <img src={chat} onClick={() => chatLogSection(invoice.caseId)}  />
                              </td>
                            </tr>
                          ))
                        }
                    </tbody>
                  </Table>
              </div> 
              {showacitivityLog ? <div className='acitityLog'>
                          <div className='acitivityNavbar'>
                              <span id="activitylog">Activity Log</span>
                              <div className='activitylogBAutton'>
                                <img src={leftButton}/>&nbsp;
                                <img src={rightButton}/>&nbsp;| &nbsp;
                                <img src={crossButton} onClick={acitivityLogClose}/>
                              </div>
                          </div>

                          <div className='activitylogContent'>
                              <div className='activitylogSectionDiv'>
                                  <div className='activitylogPoint'><img src={acitivityPointButton}/> </div>
                                  <div className='activitylogInformation'> 
                                      <div  className='activityNameAndDrop'>
                                         <span>James submitted a invoice</span>
                                         {
                                            openDetail=== false ?   <img src={dropButton} onClick={openDetailButton}/>
                                                  :
                                            <img src={upButton} onClick={closeDetailButton}/>    
                                         }
                                      </div>

                                      <div className='acitivityDetails'> 
                                         {
                                            openDetail=== true
                                                ?
                                            <div className='acitivityDetailedInfoDiv' style={{marginTop:"3%", paddingBottom:"3%"}}>
                                                <div className='acitivityDetailedInfo'>
                                                  <span className='acitivityDetailLabel'>Submitted via</span>
                                                  <span className='acitivityDetailInput'>James</span>
                                                </div>

                                                <div className='acitivityDetailedInfo'>
                                                  <span className='acitivityDetailLabel'>Invoice number</span>
                                                  <span className='acitivityDetailInput'>May-26-2024</span>
                                                </div>

                                                <div className='acitivityDetailedInfo'>
                                                  <span className='acitivityDetailLabel'>Vendor</span>
                                                  <span className='acitivityDetailInput'>Dec-26-2024</span>
                                                </div>

                                                <div className='acitivityDetailedInfo'>
                                                  <span className='acitivityDetailLabel'>Due date</span>
                                                  <span className='acitivityDetailInput'>Dec-26-2024</span>
                                                </div>

                                                <div className='acitivityDetailedInfo'>
                                                  <span className='acitivityDetailLabel'>Amount</span>
                                                  <span className='acitivityDetailInput' >$2548.00</span>
                                                </div>
                                            </div>
                                                :
                                            <span>Other details</span>
                                          }
                                          
                                         <div className='acitivityDateAndTime'>
                                            <span id='acitivityDateAndTime'>12 May 24 | 08:00 AM</span>
                                            <span className='acitivityinvoiceState' >Invoice Submission</span>
                                         </div>
                                      </div>
                                  </div>
                              </div>

                              <div className='activitylogSectionDiv' style={{marginTop:"-3%"}}>
                                  <div className='activitylogPoint'><img src={acitivityPointButton}/> </div>
                                  <div className='activitylogInformation'> 
                                      <div  className='activityNameAndDrop'>
                                         <span>James submitted a invoice</span>
                                          <img src={dropButton} />
                                      </div>

                                      <div className='acitivityDetails'> 
                                         <span>Other details</span>
                                         <div className='acitivityDateAndTime'>
                                            <span id='acitivityDateAndTime'>12 May 24 | 08:00 AM</span>
                                            <span className='acitivityinvoiceState' >Invoice Submission</span>
                                         </div>
                                      </div>
                                  </div>
                              </div>

                              <div className='activitylogSectionDiv'    style={{marginTop:"-3%"}}>
                                  <div className='activitylogPoint'><img src={acitivityPointButton}/> </div>
                                  <div className='activitylogInformation'> 
                                      <div  className='activityNameAndDrop'>
                                         <span>James submitted a invoice</span>
                                          <img src={dropButton}/>
                                      </div>

                                      <div className='acitivityDetails'> 
                                         <span>Other details</span>
                                         <div className='acitivityDateAndTime'>
                                            <span id='acitivityDateAndTime'>12 May 24 | 08:00 AM</span>
                                            <span className='acitivityinvoiceState' >Invoice Submission</span>
                                         </div>
                                      </div>
                                  </div>
                              </div>

                              <div className='activityLogExport' onClick={openModal}>
                                 Export  
                              </div> 

                              
                          </div>
                      </div>:null}
                      {showChatSection?
                        <Chat caseId={caseId} fetchInvoices={fetchInvoices} closeChat={closeChat} notDisabledChat="true"/>
                      :null} 
                      </div>
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
   
    </div>
  )
}

export default AllBills