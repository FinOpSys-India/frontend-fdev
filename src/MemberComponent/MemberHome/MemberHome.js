import React, { useEffect, useState } from "react";
import "./home.css";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AttachEmailOutlinedIcon from '@mui/icons-material/AttachEmailOutlined';
import CropFreeIcon from '@mui/icons-material/CropFree';
import ChatIcon from '@mui/icons-material/Chat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link, Navigate, useNavigate } from "react-router-dom";
import   axios from "axios" ;
import Cookies from "js-cookie"
import { Cookie } from "@mui/icons-material";
import { Modal, Button, Nav, Tab } from 'react-bootstrap';
// import TeamAndMembers from "../CompanyDetails/TeamAndMembers";


function MemberHome() {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  // const handleShow = () => setShowModal(true);


  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName === activeButton ? null : buttonName);

    if(buttonName==="settings"){
      setShowModal(true);
    }
  };


  const ButtonClick = (buttonName) => {
    setActiveButton(buttonName === activeButton ? null : buttonName);
  };


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  axios.defaults.withCredentials = true;

  const logOut= ()=>{

    axios.get("http://localhost:9000/logout-member" , )
        .then(res =>{
          console.log(res.data)
          navigate("/login-member")
          window.location.reload(true);
        })
        .catch(err => console.log(err))
  }



  return (
    <div className="dashboard">

        <div className="sideMenu dropdown">

            <div className="dropDownDetails">
                <div className="picAndName">
                    <div>
                        <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                    </div>
                    
                    <div  className="dropdown-toggle " type="button" onClick={toggleDropdown} aria-expanded={isOpen ? "true" : "false"}  >
                        <span> James Young  <ArrowDropDownIcon/></span>
                        <span className="role"> Admin </span>
                    </div>
                </div> 

                <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
                    <li>
                      <h6>abc@finopsys.ai</h6>
                      <div className="picAndNameInside">
                          <div className="IconAndPic">
                               <DragIndicatorIcon style={{ fontSize: 12, marginTop:"19%", paddingRight:"3%"  }}/>
                              <img id="innerImg" src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                          </div>
                          
                          <div  className="dropdownNameAndPic " type="button"   >
                              <span style={{fontSize:"12.6px", fontWeight:"500"}}> James Young  </span>
                              <span style={{fontSize:"10.3px", fontWeight:"500",  }} id="role"> Admin  </span>
                          </div>
                      </div> <hr/>   

                    </li>

                    <li>
                      <h6>Companies</h6>
                        <div className="picAndNameCompany">
                            <div className="IconAndPic">
                                <DragIndicatorIcon style={{ fontSize: 12, marginTop:"19%", paddingRight:"3%"  }}/>
                                <img id="innerImg" src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                            </div>
                            
                            <div  className="dropdownNameAndPic " type="button"   >
                                <span style={{fontSize:"12.6px", fontWeight:"500"}}> Company Name  </span>
                                <span style={{fontSize:"10.3px", fontWeight:"500",  }} id="companyRole"> Detail  </span>
                            </div>

                          </div> <br/>
                        
                        
                          <div className="addCompany" style={{backgroundImage:"white"}}> 
                                  <button style={{backgroundColor:"white"}}> <AddCircleOutlineIcon style={{ fontSize: 15}} /> <span style={{fontSize:"12px", fontWeight:"500",  }}> &nbsp; Add new Company</span>  </button>
                          </div><hr/>   
                    </li>

                    <li>
                      <div className="logout">
                          <h6>Settings</h6>
                          <button className="dropdown-item" type="button" style={{backgroundColor:"white",}} onClick={logOut}> Logout all accounts </button>
                      </div>
                    </li>
                </ul>
            </div>   



            <div className="dashboardHome">
               <h6>Dashboard</h6>
               <button className={activeButton === "dashboardHome" ? "clickedButton" : ""} onClick={() => handleButtonClick("dashboardHome")}> <DescriptionOutlinedIcon style={{ fontSize: 14 }}/> Home</button>
            </div> 




            <div className="AccountPayable">
                <h6>Account Payable</h6>
                <button className={activeButton === "invoiceQueue" ? "clickedButton" : ""} onClick={() => handleButtonClick("invoiceQueue")}> <DescriptionOutlinedIcon style={{ fontSize: 14 }} /> Invoice Queue</button> <br/>
                <button className={activeButton === "invoices" ? "clickedButton" : ""} onClick={() => handleButtonClick("invoices")}> <DescriptionOutlinedIcon style={{ fontSize: 14 }}/>Invoices</button><br/>
                <button className={activeButton === "credits" ? "clickedButton" : ""} onClick={() => handleButtonClick("credits")}> <DescriptionOutlinedIcon style={{ fontSize: 14 }}/>Credit</button><br/>
                <button className={activeButton === "er" ? "clickedButton" : ""} onClick={() => handleButtonClick("er")}><DescriptionOutlinedIcon style={{ fontSize: 14 }}/> ER</button><br/>
            </div> 


            <div className="AccountReceivable">
                <h6>Account Receivable</h6>
                <button className={activeButton === "invoice" ? "clickedButton" : ""} onClick={() => handleButtonClick("invoice")}> <DescriptionOutlinedIcon style={{ fontSize: 14 }}/>Invoice</button><br/>
                <button className={activeButton === "payment" ? "clickedButton" : ""} onClick={() => handleButtonClick("payment")}>  <DescriptionOutlinedIcon style={{ fontSize: 14 }}/> Payments</button><br/>
                <button className={activeButton === "vendors" ? "clickedButton" : ""} onClick={() => handleButtonClick("vendors")}>  <DescriptionOutlinedIcon style={{ fontSize: 14 }}/>Vendors</button><br/>
                <button className={activeButton === "reports" ? "clickedButton" : ""} onClick={() => handleButtonClick("reports")}>  <DescriptionOutlinedIcon style={{ fontSize: 14 }}/>Reports</button><br/>
            </div> 

             

            <div className="Help">
              <h6>Help</h6>
              <button className={activeButton === "settings" ? "clickedButton" : ""} onClick={() => handleButtonClick("settings")}>  <DescriptionOutlinedIcon style={{ fontSize: 14 }}/>Settings</button> <br/>
              <button className={activeButton === "help" ? "clickedButton" : ""} onClick={() => handleButtonClick("help")}>  <DescriptionOutlinedIcon style={{ fontSize: 14 }}/>Help</button>
            </div> 

        </div>




      <div className="rightMenu">
          <h2> Invoice Queue</h2>

          <div className="navbarInvoice">
              <div id="email" className={activeButton === "email" ? "connectButton" : ""} onClick={() => ButtonClick("email")}>  
                  Email  <AttachEmailOutlinedIcon/> <span>39</span>
              </div>

              <div id="ocr" className={activeButton === "ocr" ? "connectButton" : ""} onClick={() => ButtonClick("ocr")}>
                  OCR <CropFreeIcon/>  <span>39</span>
              </div>

              <div id="chat" className={activeButton === "chat" ? "connectButton" : ""} onClick={() => ButtonClick("chat")}>
                Chat <ChatIcon/> <span>39</span>
              </div>

              <div id="manual" className={activeButton === "manual" ? "connectButton" : ""} onClick={() => ButtonClick("manual")}>  
                    Manual <CloudUploadIcon/> <span>39</span>
              </div>


             <div id="details">
                 <div className="a">

                 </div>
             </div>
          </div>
      </div>


      <Modal show={showModal} onHide={handleClose} size="xl"  style={{ marginTop:"2%", width:"70%", marginLeft:"19%"}}
            scrollable>
          <Modal.Body>
            {/* <TeamAndMembers/> */}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>

    </div>
  );
}

export default MemberHome;