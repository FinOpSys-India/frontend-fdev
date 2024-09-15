import React, { useEffect, useState } from "react";
import logo from "./../../images/FinOpSyslogo.png";
import pic from "./../../images/Dashboard.png";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { apiEndPointUrl } from "../../utils/apiService";

function LoginMember() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    workEmail: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false); // State to remember the checkbox status
  const [error, setError] = useState(null); // State to store login error

 
  


  function onFinish(e) {
    e.preventDefault();

    // Sending values to server
    axios
      .post(`${apiEndPointUrl}/codeVerification-member`, values, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "OTP sent successfully!") {
          // phoneNumber = res.data.phoneNumber
          // console.log("phoneNumber");

          // Store in cookies if rememberMe is true
          if (rememberMe) {
            Cookies.set("workEmail-member", values.workEmail, { expires: 7 }); // Expires in 7 days
            Cookies.set("password-member", values.password, { expires: 7 }); // Expires in 7 days
          } else {
            // Clear cookies if rememberMe is false
            Cookies.remove("workEmail-member");
            Cookies.remove("password-member");
          }



          navigate("/codeVerification-member",{ state: res.data.phoneNumber} );
        } else {
          console.log("Login failed: ", res.data.Error);
          setError(res.data.Error); // Set error state with the error message
        }
      })
      .catch((err) => {
        console.error("Login error: ", err);
        setError("Login failed: " + err.message); // Set error state with the error message
      });
  }

  // Function to handle checkbox change
  function handleCheckboxChange(e) {
    setRememberMe(e.target.checked);
  }

  // Effect to check if user has previously opted for rememberMe
  useEffect(() => {
    const savedEmail = Cookies.get("workEmail-member");
    const savedPassword = Cookies.get("password-member");

    if (savedEmail && savedPassword) {
      setValues({
        workEmail: savedEmail,
        password: savedPassword
      });
      setRememberMe(true); // Set checkbox to checked if credentials are found
    }
  }, []); // Empty dependency array means it runs once on component mount

  return (
    <div>
      <nav className="navbar" style={{ height: "12px" }}>
        <img src={logo} alt="Logo" />
      </nav>
        {/* <div className="container">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <div className="imageContainer">
            <img src={pic} alt="pic" />
          </div>
          <div className="circle circle3"></div>
        </div> */}



      <div className="loginDashboard">
        <div className="loginform">
          <form onSubmit={onFinish}>
            <div className="HeadingAndCaption">
              <h3>Welcome Back</h3>
              <span>Enter your email and password to access dashboard.</span>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label email">
                Email <span style={{color:"red"}}>*</span>
              </label>
              <input
                type="email"
                className="form-control input"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter your email" required
                value={values.workEmail}
                onChange={(e) =>
                  setValues({ ...values, workEmail: e.target.value })
                }
              />
            </div>

            <div className="mb-3 div">
              <label htmlFor="password" className="form-label">
                Password <span style={{color:"red"}}>*</span>
              </label>
              <input
                type="password"
                className="form-control input"
                id="password"
                placeholder="Enter your password" required
                value={values.password} onChange={(e) =>  setValues({ ...values, password: e.target.value })  }
              />

                 {error && <div className="error-message" style={{fontSize:"12px", fontWeight:"500", color:"red"}}>{error}</div>}

            </div>

            <div className="mb-3 form-check div">
              <input
                type="checkbox"
                className="form-check-input check"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            <div className="div">
              <button type="submit" className="loginBtn">
                Log In
              </button>
            </div>

            <div className="div linkDiv">
              <Link to="/reset-member" className="forget reseting"> Reset password? &nbsp; | </Link>
              <Link to="/signup-member" className="forget signup"> SignUp  </Link>
            </div>
          </form>
        </div>

          <div className="imageDiv">
                <img src={pic} alt="pic" style={{height:"auto", width:"100%"}} />
            </div>

      </div>

    </div>
  );
}

export default LoginMember;
