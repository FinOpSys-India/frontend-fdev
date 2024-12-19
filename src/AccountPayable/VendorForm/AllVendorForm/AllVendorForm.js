import React, { useState } from 'react'
import Home from '../../../Home/Home'
import { Table } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";  
import axios from "axios";
import { useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import  "./AllVendorForm.css";
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { roles } from '../../../utils/constant';
// import plus from '../../assets/plus.svg';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BlankVendor from '../BlankVendor/BlankVendor';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Pagination from '@mui/material/Pagination';

function AllVendorForm() {

    
    const [selectedItem, setSelectedItem] = useState('All Vendors');
    const [activeButton, setActiveButton] = useState(null);
    const [vendorList, setvendorList] = useState(true);
    const navigate = useNavigate();
    const [acitivityLogButton, setacitivityLogButton] = useState(false);
    // const [pageNumber, setPageNumber] = useState(1);
    // const itemsPerPage1 = 10; // Number of items per page
    // const totalItems = 99; // Example total number of items (coins)
    // const [itemsPerPage] = useState(7); 
    
      //  -------------- dropdown-------------
    const handleSelect = (eventKey) => {
        setSelectedItem(eventKey);
      };
  
      const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName === activeButton ? null : buttonName);
        navigate(`/${buttonName}`); // Navigates to the path based on button name
      };



      
    // // -----------------------Calculate pagination---------
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    //   const handlePageChange = (event, value) => {
    //     setPageNumber(value);
    //     setCurrentPage(value);
    //     // Fetch or update your data for the new page here
    //   };
    
    //   // Calculate total pages
    //  const totalPages = Math.ceil(totalItems / itemsPerPage);


  return (

    <div style={{display:"flex"}}>
        <Home currentPage="vendor-form" />
        
        <div className='vendorTab'>
            <div className='vendorNavbar'>
            
                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle  id="" className="vendorDropDown">
                    <p>{selectedItem} <ArrowDropDownIcon/></p> 
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='vendorDropdownItem'>
                        <Dropdown.Item className='vendorDropdownEachItem' eventKey="Unpaid Vendor" onClick={() => handleButtonClick('unpaid-vendor')}>Unpaid Vendor</Dropdown.Item>
                        <Dropdown.Item className='vendorDropdownEachItem' eventKey="Paid Vendor" onClick={() => handleButtonClick('paid-vendor')}>Paid Vendor</Dropdown.Item>
                        {/* {(role != roles.approver1 && role !==roles.approver2)?<Dropdown.Item className='vendorDropdownEachItem' eventKey="All vendors" onClick={() => handleButtonClick('all-vendors')}>All vendors</Dropdown.Item>:null} */}
                    </Dropdown.Menu>
                    </Dropdown>

                    <div className='vendorNavbarSideButtons'> 
                        <div className='vendorSearchBar'>
                            <SearchIcon style={{ fontSize: '19px', position: 'absolute', top: '33px', left: '79%',color: 'grey', }}/>    
                            <input id="vendorNameSearch"  type="text"  className="form-control" placeholder="Search"/>
                        </div> 
                        <button className='vendorNavbarExportButton'> <AddIcon style={{ fontSize: '19px'}}/>Add Vendor</button>
                    </div>
            </div>

            {
                 vendorList===true
                    ?
                    <div className="mt-4 d-flex flex-column align-items-center outerTableDiv">
                        <Table className="custom-width">
                            <thead>
                            <tr>
                                <th> <input type="checkbox"  />   &nbsp;&nbsp;&nbsp;Company </th>
                                <th>Contact Person Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Credit left</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                                {/* {
                                // currentItems.map((invoice, index) => (
                                    // <tr key={invoice.billId}>
                                    <td onClick={() => handleShowPreview(invoice, index)}>
                                        <input type="checkbox" />{" "}
                                        <img
                                        src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                                        alt="Vendor Avatar"
                                        />
                                        &nbsp;&nbsp;&nbsp;{invoice.billId}
                                    </td>
                                    <td   {invoice.vendorName}</td>
                                    <td {new Date(invoice.receivingDate).toLocaleDateString()} </td>
                                    <td {new Date(invoice.dueDate).toLocaleDateString()} </td>
                                    {(role != roles.approver1 && role !=roles.approver2) ? <td {invoice.status=="AcceptedByAP" ?"Approver 1":"Approver 2"}</td>:null}
                                    <td  {invoice.amount}</td>
                                    <td id="">
                                        <img src={chat} onClick={() => chatLogSection(invoice.caseId)} />
                                    </td>
                                    </tr>
                                ))
                                } */}
                                <tr>
                                <td >
                                        <input type="checkbox" />{" "}
                                        <img
                                        src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                                        alt="Vendor Avatar"
                                        />
                                        &nbsp;&nbsp;&nbsp;Louis Vuitton
                                    </td>
                                    <td> Bessie Cooper</td>
                                    <td >debra.holt@example.com </td>
                                    <td >(406) 555-0120</td>
                                    <td >$1,878.50</td>
                                    <td >$1,878.50</td>
                                    <td> <ChevronRightIcon/> </td>
                                </tr>
                                <tr>
                                <td >
                                        <input type="checkbox" />{" "}
                                        <img
                                        src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                                        alt="Vendor Avatar"
                                        />
                                        &nbsp;&nbsp;&nbsp;Louis Vuitton
                                    </td>
                                    <td> Bessie Cooper</td>
                                    <td >debra.holt@example.com </td>
                                    <td >(406) 555-0120</td>
                                    <td >$1,878.50</td>
                                    <td >$1,878.50</td>
                                    <td> <ChevronRightIcon/> </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                    :
                <BlankVendor/>
            }
        </div>

         <div className="pagination-div">
            <div className='pagination-insideDiv'>
                {/* <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                /> */}
            </div>
        </div>
   </div>
  )       
}  
export default AllVendorForm



