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
import chat from '../../../assets/chat.svg';
import { ToastContainer, toast } from "react-toastify";
import  "./PendingBills.css";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { roles } from '../../../utils/constant';
import Chat from '../../Chat/Chat';
import PreviewSection from '../../AQ/PreviewSection/PreviewSection';



function PendingBills() {

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
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [currentInvoiceIndex, setcurrentInvoiceIndex] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState('Pending Bills');
    const [activeButton, setActiveButton] = useState(null);
    const navigate = useNavigate();
    const [acitivityLogButton, setacitivityLogButton] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [showAcceptDecline, setShowAcceptDecline] = useState(false);
    const [caseId,setCaseId] = useState("");
    const role=sessionStorage.getItem('role');
    
const closeChat = () => {
  setacitivityLogButton(false); // Close the chat
  setCaseId(null); // Clear the active caseId
};
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
        const currentPage="pendingInBills"
        const response = await axios.get(`${apiEndPointUrl}/get-invoices`, {
          params: { page, itemsPerPage,role,currentPage },
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


 // -------------------chatLogSection--------------------------------
 
   function chatLogSection(newCaseId){
    if (caseId !== newCaseId) {
      setCaseId(newCaseId); // Update the active chat caseId
      setacitivityLogButton(true); // Open the chat section
    }
    // setacitivityLogButton(true);
    // setCaseId(invoices[index].caseId);
   }


   function acitivityLogClose(){
    setacitivityLogButton(false)
   }

   function openDetailButton(){
    setOpenDetail(true);
   }

   function closeDetailButton(){
    setOpenDetail(false);
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
                      <Dropdown.Item className='billDropdownEachItem' eventKey="Decline Bills" onClick={() => handleButtonClick('decline-Bills')}>Decline Bills</Dropdown.Item>
                      <Dropdown.Item className='billDropdownEachItem' eventKey="Approved Bills" onClick={() => handleButtonClick('approved-Bills')}>Approved Bills</Dropdown.Item>
                      {(role != roles.approver1 && role !==roles.approver2)?<Dropdown.Item className='billDropdownEachItem' eventKey="All Bills" onClick={() => handleButtonClick('all-Bills')}>All Bills</Dropdown.Item>:null}
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

              {
                 !acitivityLogButton
                           ?
                      <div className="mt-4 d-flex flex-column align-items-center outerTableDiv">
                        <Table className="custom-width">
                          <thead>
                            <tr>
                              <th> <input type="checkbox"  />   &nbsp;&nbsp;&nbsp; Bill Number</th>
                              <th>Vendor Name</th>
                              <th>Bill Date</th>
                              <th>Due date</th>
                              {(role != roles.approver1 && role !=roles.approver2) ? <th>Current Approver</th>:null}
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
                                    <td onClick={() => handleShowPreview(invoice, index)}>{new Date(invoice.dueDate).toLocaleDateString()} </td>
                                    {(role != roles.approver1 && role !=roles.approver2) ? <td onClick={() => handleShowPreview(invoice, index)}>{invoice.status=="AcceptedByAP" ?"Approver 1":"Approver 2"}</td>:null}
                                    <td onClick={() => handleShowPreview(invoice, index)}> {invoice.amount}</td>
                                    <td id="">
                                        <img src={chat} onClick={() => chatLogSection(invoice.caseId)} />
                                    </td>
                                  </tr>
                                ))
                              }
                          </tbody>
                        </Table>
                      </div>
                                            :

                      <div className="tableWithPendiingBillChat" >
                          <div className="mt-4 d-flex flex-column align-items-center outerTableDiv" id='PendiingBillChatTable'>
                            <Table className="custom-width">
                              <thead>
                                <tr>
                                  <th> <input type="checkbox"  />   &nbsp;&nbsp;&nbsp; Bill Number</th>
                                  <th>Vendor Name</th>
                                  <th>Bill Date</th>
                                  <th>Due date</th>
                                  {role != (roles.approver1 || roles.approver2) ? <th>Current Approver</th>:null}
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
                                        <td onClick={() => handleShowPreview(invoice, index)}>{new Date(invoice.dueDate).toLocaleDateString()} </td>
                                        {role != (roles.approver1 || roles.approver2) ? <td onClick={() => handleShowPreview(invoice, index)}>{invoice.status=="AcceptedByAP" ?"Approver 1":"Approver 2"}</td>:null}
                                        <td onClick={() => handleShowPreview(invoice, index)}> {invoice.amount}</td>
                                        <td id="">
                                            <img src={chat} onClick={() => chatLogSection(invoice.caseId)}  />
                                        </td>
                                      </tr>
                                    ))
                                  }
                              </tbody>
                            </Table>
                          </div>
                          
                            <Chat caseId={caseId} fetchInvoices={fetchInvoices} closeChat={closeChat} notDisabledChat="true"/>
                     </div>
                } 
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

export default PendingBills











// pending and approve tab;e 1