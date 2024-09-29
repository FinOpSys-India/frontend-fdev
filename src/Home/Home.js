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

function Home(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(props.currentPage);
  const [showModal, setShowModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
          {isCollapsed ? (<h6 style={{margin:"30%"}}>AP</h6>) : (<h6>Account Payable</h6>)}
          {isCollapsed ? (
            <div className="accountPayableButtonsCollapsed">

              <img src={approvalQueuelogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("invoiceQueue")} />
              <br />
              <img src={billslogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("credits")} />
              <br />
              <img src={wipcclogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("credits")} />
              <br />
              <img src={wiperlogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("er")} />
              <br />
              <img src={vendorslogo} style={{ width: "2em", height: "2em" }} onClick={() => handleButtonClick("er")} />
              <br />
              <img src={insightslogo} style={{ width: "2em", height: "2em" }} />
            </div>) : (<div className="accountPayableButtons">
              <button
                className={activeButton === "invoiceQueue" ? "connectButton" : ""}
                onClick={() => handleButtonClick("invoiceQueue")}
              >
                <img
                  src={approvalQueuelogo}
                  style={{ width: "2em", height: "1em" }}
                />
                Approval Queue
              </button>
              <br />
              <button
               className={activeButton === "billAQButton" ? "connectButton" : ""}
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
              <br />
              <button
                className="accountPayableButton"
                onClick={() => handleButtonClick("er")}
              >
                <img src={vendorslogo} style={{ width: "2em", height: "1em" }} />
                Vendors
              </button>
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
              className="dropdown-toggle"
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen ? "true" : "false"}
            ><span>
                User Name <ArrowForwardIosOutlinedIcon style={{ height: '50%' }} /></span>
              <span>abc@finopsys.ai</span>            </div>
            )}


          </div>

          <ul
            className={`dropdown-menu ${isOpen ? "show" : ""}`}
            onClick={toggleMenu}
          >

            <li>
              <h6 style={{ marginTop: "-5%", marginLeft:'-0.5%' }}>abc@finopsys.ai</h6>
              <div className="picAndNameInside">
                <DragIndicatorIcon
                  style={{
                    fontSize: 10,
                    marginTop:"10%"
                  }}
                />
                  <img
                    className="profilePic"
                    id="innerImg"
                    src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                    alt="Profile"
                    style={{
                      marginTop:"6%"
                    }}
                  />

                <div className="dropdownNameAndPic">
                  <span style={{ fontSize: "10.5px", fontWeight: "500" }}>User Name
                  </span>
                  <br></br>
                  <span
                    style={{ fontSize: "9.3px", fontWeight: "500" }}
                  >
                    abc@finopsys.ai

                  </span>
                </div>
              </div>
              <hr />
            </li>

            <li>
              <div className="companiesHeader">
                <h6 style={{ marginTop: "-10%" , marginLeft:'-0.5%' }}>Companies</h6>
                <AddCircleOutlineIcon style={{ fontSize: 15, marginTop:'-7%'}} />
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
                  />
                <div className="dropdownNameAndPic" type="button">
                  <span style={{ fontSize: "10.5px", fontWeight: "500" }}>Company Name
                  </span>
                </div>
              </div>
              <hr />
            </li>

            <div style={{marginTop:'-3%'}} className="settingWithLogout">
                <li>
                  <button style={{ fontSize: "10.5px", backgroundColor: "white", border:'none' }} onClick={() => handleButtonClick("settings")}>Settings</button>
                </li>
                <li>
                  <button
                    style={{ fontSize: "10.5px", backgroundColor: "white" , border:'none'}}
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
