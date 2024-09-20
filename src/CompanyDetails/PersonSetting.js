import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PersonSetting.css"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccessControl from "./AccessControl/AccessControl";
import Profile from "./Profile/Profile";
import TeamAndMember from "./TeamAndMember/TeamAndMember";
import CompaniesDetails from "./CompaniesDetails/CompaniesDetails";
import Integration from "./Integration/Integration";


const PersonSetting = () => {

  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName === activeButton ? null : buttonName);

    

  };


  // const ButtonClick = (buttonName) => {
  //   setActiveButton(buttonName === activeButton ? null : buttonName);
  // };


  return (
    <div className="dashboardPop">
        <div className="leftMenu">
            <div className="imageAndDetails">
                <img  src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                <div>
                  <h5 className="name ">James Young</h5>
                  <p className="admin ">Admin</p>
                </div>
            </div>

          
            <div className="companySection">
                <h6>Company</h6>
                <button className={activeButton === "profile" ? "clickedButton" : ""} onClick={() => handleButtonClick("profile")}> <AddCircleOutlineIcon style={{ fontSize: 14, marginRight:"9px" }} />    Profiles </button> <br/>
                <button className={activeButton === "companies" ? "clickedButton" : ""} onClick={() => handleButtonClick("companies")}> <AddCircleOutlineIcon style={{ fontSize: 14 ,  marginRight:"9px"  }}/>Companies</button><br/>
                <button className={activeButton === "teamAndMembers" ? "clickedButton" : ""} onClick={() => handleButtonClick("teamAndMembers")}> <AddCircleOutlineIcon style={{ fontSize: 14 ,  marginRight:"9px"  }}/>Team & Members</button><br/>
                <button className={activeButton === "accessControl" ? "clickedButton" : ""} onClick={() => handleButtonClick("accessControl")}><AddCircleOutlineIcon style={{ fontSize: 14 ,  marginRight:"9px"  }}/>Access Control</button><br/>
            </div>

            <div className="dashboardSettings">
                <h6>Dashboard Settings</h6>
                <button className={activeButton === "notification" ? "clickedButton" : ""} onClick={() => handleButtonClick("notification")}> <AddCircleOutlineIcon style={{ fontSize: 14 ,  marginRight:"9px"  }} />  Notifications </button> <br/>
                <button className={activeButton === "security" ? "clickedButton" : ""} onClick={() => handleButtonClick("security")}> <AddCircleOutlineIcon style={{ fontSize: 14 ,  marginRight:"9px"  }}/>Security</button><br/>
                <button className={activeButton === "integration" ? "clickedButton" : ""} onClick={() => handleButtonClick("integration")}> <AddCircleOutlineIcon style={{ fontSize: 14 ,  marginRight:"9px"  }}/>Integration</button><br/>
                <button className={activeButton === "connection" ? "clickedButton" : ""} onClick={() => handleButtonClick("connection")}><AddCircleOutlineIcon style={{ fontSize: 14 ,  marginRight:"9px"  }}/> Connection</button><br/>
            </div> 
        </div>




        <div className="rightSide">

            {
              activeButton === "accessControl" 
                       ?
                <AccessControl />
                      : 
              activeButton === "profile" 
                      ? 
                <Profile />
                      : 
              activeButton === "teamAndMembers" 
                      ? 
                <TeamAndMember />
                       :
                activeButton === "companies" 
                       ? 
                 <CompaniesDetails />
                      :
                 activeButton === "integration" 
                        ? 
                  <Integration />
                        :
                      null
            }
        </div>

    </div>
  );
};

export default PersonSetting;
