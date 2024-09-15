import React, { createContext, useEffect, useState } from "react";
import "./profile.css";
import axios from "axios"
import { apiEndPointUrl } from "../../utils/apiService";


export const PersonContext = createContext();

const Profile = () => {

  const[person, setPerson] = useState([]);


  axios.defaults.withCredentials = true;

  useEffect(() => {

  const fetching= async () => {
    axios.get(`${apiEndPointUrl}/get-person-details`)
    .then((res) => {
      setPerson(res.data);
      console.error(" fetching", res.data);
    })
    .catch((error) => {
      console.error("Error fetching :", error);
    });
  };

  fetching()
  }, []);



  return (
    <div>
        <form>
              <h5 className="profile">Profile</h5>

            <div className="sub-heading">
              <p>User Name</p>
            </div>

            <div className="mainDivProfile">
                  <div className="logoContent">
                    <img className="logo" src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                    <div className="content">
                      <p className="formLabel my-label">Avatar</p>
                      <p className="info label-value">Change Avatar</p>
                    </div>
                  </div>

                  <div style={{ marginRight: "200px"  ,  marginTop:"-20px"}}>
                    <p className="my-label formLabel">User Name</p>
                    <p className="label-value info">Joy@fan34</p>
                  </div>
            </div>

            
            {
                Array.isArray(person) && person.length > 0 
                          ? 
                 person.map((p, index) => (
                  <div key={index}>
                      <div className="sub-heading2">
                        <p>Personal Information</p>
                      </div>

                      <div className="personalInformation">
                        <div className="firstDiv">
                          <div>
                            <p className="my-label">First Name</p>
                            <p className="label-value"> {p.FIRSTNAME}</p>
                          </div>
                          <div>
                            <p className="my-label">Middle Name</p>
                            <p className="label-value">Joy@fan34 {}</p>
                          </div>
                          <div>
                            <p className="my-label">Last Name</p>
                            <p className="label-value">{p.LASTNAME}</p>
                          </div>
                        </div>

                        <div className="secondDiv">
                          <div>
                            <p className="my-label">Phone Number</p>
                            <p className="label-value">{p.PHONENUMBER}</p>
                          </div>
                          <div>
                            <p className="my-label">Email Address</p>
                            <p className="label-value">{p.WORKMAIL}</p>
                          </div>
                        </div>

                        <div className="thirdDiv">
                          <div>
                            <p className="my-label">Position</p>
                            <p className="label-value">Joy@fan34</p>
                          </div>
                          <div>
                            <p className="my-label">Address</p>
                            <p className="label-value">Joy@fan34</p>
                          </div>
                        </div>
                      </div>

                      <div className="sub-heading3">
                        <p>Password</p>
                      </div>

                      <div className="mainDivProfile">
                        <div >
                          <p className="my-label passwordLabel">Password</p>
                          <p className="label-value passwordProfile">Joy@fan34</p>
                        </div>

                        <div>
                          <p className="my-label passwordLabel ">Password</p>
                          <p className="label-value">Joy@fan34</p>
                        </div>
                      </div>
                  </div>
                   ))
                   :
                    <p>No person data available.</p>
                  }
        </form> 
    </div>
  );
};

export default Profile;
