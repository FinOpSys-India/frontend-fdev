import React, { useEffect, useState, useRef } from "react";
import "./home.css";
import AttachEmailOutlinedIcon from "@mui/icons-material/AttachEmailOutlined";
import CropFreeIcon from "@mui/icons-material/CropFree";
import ChatIcon from "@mui/icons-material/Chat";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Nav, Tab } from "react-bootstrap";
import PersonSetting from "../CompanyDetails/PersonSetting";
import approvalQueuelogo from "../assets/approvalQueue.svg";
import billslogo from "../assets/bills.svg";
import insightslogo from "../assets/insights.svg";
import vendorslogo from "../assets/vendors.svg";
import wiperlogo from "../assets/wip_er.svg";
import wipcclogo from "../assets/wip_cc.svg";
import finopsysBigLogo from "../assets/finopsysBig.svg";
import finopsysSmallLogo from "../assets/finopsysSmall.svg";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { apiEndPointUrl } from "../utils/apiService";
import { roles } from "../utils/constant";

function Home(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(props.currentPage);
  const [showModal, setShowModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workEmail, setWorkEmail] = useState('');
  const role = sessionStorage.getItem('role');
  const respectiveRoles = {ApPerson:"Account Payable",Approver1:"Approver One", Approver2:"Approver Two", DepartMentHead:"DepartMent Head"} 
  const handleClose = () => setShowModal(false);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName === activeButton ? null : buttonName);

    if (buttonName === "settings") {
      setShowModal(true);
    }
    else navigate(`/${buttonName}`)
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  axios.defaults.withCredentials = true;

  const logOut = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem('role');
    axios
      .get(`${apiEndPointUrl}/logout`)
      .then((res) => {
        console.log(res.data);

        navigate("/login");
        window.location.reload(true);
      })
      .catch((err) => console.log(err));
  };

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [dropdownRef]);


  useEffect(() => {
    axios.get(`${apiEndPointUrl}/emails`)  // Replace with your backend URL
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching emails:', error);
      });


      
      let email = document.cookie.split('; ').find(row => row.startsWith('workEmail='))?.split('=')[1];
      setWorkEmail(email); 
  }, []);


  return (
    <div className={`${isCollapsed ? "collapsed" : "sideMenu"}`} style={{ width:isCollapsed ? "5%" : "12.5%" ,backgroundColor:"#f5f1fe", height:"100vh", position: "relative"}} >
        <div className="finopsysLogo" style={{margin: isCollapsed ? "20%" : "10%" , marginTop: isCollapsed ? "30%" : "10%"}}>
          {isCollapsed ? (<img
            src={finopsysSmallLogo}
            style={{ width: "57%", height: "20%" }} />) :
            <img
              src={finopsysBigLogo}
              style={{ width: "80%"}}
            />
          }
          {isCollapsed ? (<button className="collapseArrow" style={{
            backgroundColor: 'white', borderRadius: "20px", marginLeft: "32%", boxShadow: "0.2px 0.2px grey",
            height: "34px", width: "34px", border: "none"
          }} onClick={toggleCollapse}> <ArrowForwardIosOutlinedIcon style={{ height: "15px", width:"15px", margin: "12%", marginBottom:"32%", color:"#141414" }} /> </button>) :
            (<button className="collapseArrow" style={{
              backgroundColor: 'white', borderRadius: "20px", marginLeft: "24%", boxShadow: "0.2px 0.2px grey",
              height: "34px", width: "34px",border: "none",
            }} onClick={toggleCollapse}> <ArrowBackIosOutlinedIcon style={{ height: "15x", width:"15px", margin: "10%",color:"#141414" }} />  </button>)}
        </div>

        <div className="accountPayableHeading" >
          {isCollapsed ? (<h6 style={{margin:"30%"}}>AP</h6>) : (<h6>{respectiveRoles[role  ]}</h6>)}
          {isCollapsed ? (
            <div className="accountPayableButtonsCollapsed">

{(role !=roles.approver1 && role !=roles.approver2)?<><img src={approvalQueuelogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("invoiceQueue")} /><br /></>:null }
            
              <img src={billslogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("billAQButton")} />
              <br />
              <img src={wipcclogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("credits")} />
              <br />
              <img src={wiperlogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("er")} />
              <br />
              {role===roles.apPerson? <img src={vendorslogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("vendor")} />:null}
              <br />
              <img src={insightslogo} style={{ width: "2em", height: "2em" }} />
            </div>) : (<div className="accountPayableButtons">
              {(role !=roles.approver1 && role !=roles.approver2)?
              <>
              <button
                className={activeButton === "invoiceQueue" ? "connectButton" : "AQHover"}
                onClick={() => handleButtonClick("invoiceQueue")}
              >
                <img
                  src={approvalQueuelogo}
                  style={{ width: "2em", height: "1em" }}
                />
                Approval Queue
              </button><br /></>:null}
              
              <button
               className={activeButton === "billAQButton" ? "connectButton" : "AQHover"}
               onClick={() => handleButtonClick("billAQButton")}
              >
                {" "}
                <img src={billslogo} style={{ width: "2em", height: "1em" }} onClick={() => handleButtonClick("credits")} />
                Bills
              </button>
              <br />
              <button
                className="accountPayableButton"
                onClick={() => handleButtonClick("credits")}
              >
                {" "}
                <img src={wipcclogo} style={{ width: "2em", height: "1em" }} />
                WIP_CC
              </button>
              <br />
              <button
                className="accountPayableButton"
                onClick={() => handleButtonClick("er")}
              >
                <img src={wiperlogo} style={{ width: "2em", height: "1em" }} />
                WIP_ER
              </button>
              {role===roles.apPerson?<br />:null}
              {role===roles.apPerson? <button
                className={activeButton === "vendor-form" ? "connectButton" : "AQHover"}
                onClick={() => handleButtonClick("vendor")}
              >
                <img src={vendorslogo} style={{ width: "2em", height: "1em" }} />
                Vendors
              </button>:null}
              <br />
              <button
                className="accountPayableButton"
                onClick={() => handleButtonClick("er")}
              >
                <img src={insightslogo} style={{ width: "2em", height: "1em" }} />
                Insights
              </button>
            </div>)}
        </div>
        <hr />

        <div
          className="dropDownDetails"
          ref={dropdownRef}
        >
          <div
            className="userNameBox"
          >
            <div>
              <img
                className="profilePic"
                src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                alt="Profile"
              />
            </div>


            {isCollapsed ? (<div
              className="dropdown-toggle"
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen ? "true" : "false"}
            ><span> <ArrowForwardIosOutlinedIcon style={{ height: '50%' }} /></span>            </div>
            ) : (<div
              className="dropdown-toggle HomeAP"
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen ? "true" : "false"}
            ><span>
                &nbsp;&nbsp; &nbsp;&nbsp; User Name &nbsp;&nbsp;<ArrowForwardIosOutlinedIcon style={{ height: '50%' }} /></span>
              <span>{workEmail}</span>            </div>
            )}


          </div>

          <ul
            className={`dropdown-menu ${isOpen ? "show" : ""}`}
            onClick={toggleMenu}
          >

            <li>
              <h6 style={{ marginTop: "-5%", marginLeft:'-0.5%' }} className="HomeUser">{workEmail}</h6>
              <div className="picAndNameInside">
                {/* <DragIndicatorIcon
                  style={{
                    fontSize: 10,
                    marginTop:"10%"
                  }}
                /> */}

                <div className="dropdownNameAndPic">
                  <img
                      className="profilePic"
                      id="innerImg"
                      src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                      alt="Profile"
                      style={{
                        marginTop:"1%"
                      }}
                    /> &nbsp;&nbsp; 
                    <span style={{ fontSize: "10px", fontWeight: "500" }}>{workEmail}
                    </span>
                    <br></br>
                    <span
                      style={{ fontSize: "10px", marginLeft:"19%", fontWeight: "500" ,color: "rgba(140, 140, 140, 1)"
                      }}
                    >
                      {role}

                  </span>
                </div>
              </div>
              <hr />
            </li>

            <li>
              <div className="companiesHeader">
                <h6 style={{ marginTop: "-10%" , marginLeft:'-0.5%' }}>Companies</h6>
                <AddCircleOutlineIcon style={{ fontSize: 15, marginTop:'-7%',color: "rgba(140, 140, 140, 1)"
                  }} />
              </div>
              <div className="picAndNameCompany">
              <DragIndicatorIcon
                    style={{
                      fontSize: 10,
                      marginTop: "6%",
                    }}
                  />
                  <img
                    id="innerImg"
                    src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                    alt="Company"
                    style={{
                      marginTop:"6%"
                    }}
                  />
                <div className="dropdownNameAndPic" type="button">
                  <span style={{ fontSize: "12px", fontWeight: "500" }}>Company Name
                  </span>
                </div>
              </div>
              <hr />
            </li>

            <div style={{marginTop:'-3%'}} className="settingWithLogout">
                <li>
                  <button style={{ fontSize: "12px", backgroundColor: "white", border:'none' ,color: "rgba(140, 140, 140, 1)"
                    }} onClick={() => handleButtonClick("settings")}>Settings</button>
                </li>
                <li>
                  <button
                    style={{ fontSize: "12px", backgroundColor: "white" , border:'none',color: "rgba(140, 140, 140, 1)"
                    }}
                    onClick={logOut}
                  >
                    Logout
                  </button>
                </li>
                </div>
          </ul>
        </div>
      

      {/* <div className="rightMenu"> */}

        
  
{/* 
      {
              activeButton === "accountPayableButton" 
                       ?
                <AQ />
                 :
                 activeButton ==="billAQButton"
                 ?
              <Bills/>
                 :""

      } */}
        
      {/* </div> */}

    
      <Modal
        show={showModal}
        onHide={handleClose}
        size="xl"
        style={{ marginTop: "2%", width: "70%", marginLeft: "19%" }}
        scrollable
      >
        <Modal.Body>
          <PersonSetting />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;
