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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BlankVendor from '../BlankVendor/BlankVendor';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Pagination from '@mui/material/Pagination';
import AddVendorFormButton from '../AddVendorFormButton/AddVendorFormButton';
import { apiEndPointUrl } from '../../../utils/apiService';



function AllVendorForm() {

    
    const [selectedItem, setSelectedItem] = useState('All Vendors');
    const [activeButton, setActiveButton] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
     const [vendorData, setVendorData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [itemsPerPage] = useState(7); 
    const [currentPage, setCurrentPage] = useState(1);



      //  -------------- dropdown-------------
    const handleSelect = (eventKey) => {
        setSelectedItem(eventKey);
      };
  
      const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName === activeButton ? null : buttonName);
        navigate(`/${buttonName}`); // Navigates to the path based on button name
      };




    //   -------handleAddVendor------------
      const addVendor = () => {
        setShowModal(true);
      };
    

      const handlePageChange = (event, value) => {
        setCurrentPage(value);
        setPageNumber(value);
      };
    

  //------------ Calculate pagination----------------
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = vendorData.slice(indexOfFirstItem, indexOfLastItem);


      // Calculate total pages
     const totalPages = Math.ceil(vendorData.length/itemsPerPage);


    
  
    //------------------------- Fetch invoices from the backend-------------------
    const fetchVendor = async (page) => {
        try {
          console.log("srDta" )
          const response = await axios.get(`${apiEndPointUrl}/get-vendor`
            , {
            params: { page, itemsPerPage ,currentPage}
          });
  
          // console.log("setVendorData",response.data[1].VENDOR_NAME )
          setVendorData(response.data);} catch (error) {
          toast.error("Failed to fetchVendor ", { autoClose: 1500 });
        }
      };


      
        useEffect(()=>{
          fetchVendor(currentPage);
      },[currentPage])
      
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
                        <button className='vendorNavbarExportButton' onClick={addVendor}> <AddIcon style={{ fontSize: '19px'}} />Add Vendor</button>
                        <AddVendorFormButton
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            // component={modalComponent}
                        />
                    </div>
            </div>

            {
                 vendorData.length >0
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
                              
                            {
                                currentItems.map((vendor, index) => (
                                  <tr key={vendor.VENDOR_NAME}>
                                    <td>
                                      <input type="checkbox" />{" "}
                                      <img
                                        src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                                        alt="Vendor Avatar"
                                      />
                                      &nbsp;&nbsp;&nbsp;{vendor.COMPANY_NAME}
                                    </td>
                                    <td>{vendor.VENDOR_NAME}</td>  
                                    <td>{vendor.EMAIL_ADDRESS}</td> 
                                    <td>{vendor.PHONE_NUMBER}</td>  
                                    <td> 555-0120	$1,878.50</td>    
                                    <td> 555-0120	$1,878.50</td> 
                                    <td><ChevronRightIcon/> </td>      
                                  </tr>
                                ))
                              }
                            </tbody>
                        </Table>
                    </div>

                    :
                <BlankVendor/>
            }
        </div>

         <div className="pagination-div">
            <div className='pagination-insideDiv'>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
   </div>
  )       
}  
export default AllVendorForm



