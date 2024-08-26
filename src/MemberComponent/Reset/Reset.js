import React, { useState } from "react";
import logo from "./../../images/FinOpSyslogo.png";
import pic from "./../../images/Dashboard.png"
import "./reset.css";
import {  useNavigate } from "react-router-dom";
import axios from "axios"
import { Modal, Button } from 'react-bootstrap';


function ResetMember() {

  const navigate = useNavigate(); 
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState('');
  const [values, setValues] = useState({
      workEmail :"",
      password:"",
      confirmPassword:""

  });


  

  // ----------------------------------Credinastlity of -----------------------------

  const validatePassword = (password) => {
    // Password criteria regex checks
    const regex = {
      minLength: /^.{8,16}$/,
      alphabet: /[a-zA-Z]/,
      number: /\d/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/
    };

    return (
      regex.minLength.test(password) &&
      regex.alphabet.test(password) &&
      regex.number.test(password) &&
      regex.specialChar.test(password)
    );
  };


  


  function onFinish(e){
    e.preventDefault();


    if (!validatePassword(values.password)) {
        setErrorMessage('Password must be 8-16 characters and contain at least one alphabet(A-Z), one number(0-9), and one special character(@#$%^&...)!');
        setPasswordError(true);
        return;
      }
      else if (values.password !== values.confirmPassword) {
        setErrorMessage('Password not matched !');
        setPasswordError(true);
      } 
      else {
        setPasswordError(false);
  
    axios
        .post("http://localhost:9000/reset-password-member", values, { withCredentials: true })
        .then((res) => {
          if (res.data.message === 'Password updated successfully') {
            navigate('/update-member');
          } 
          else {
            setErrorMessage("No email exists !");
            setPasswordError(true); 
          }
        })
        .catch((err) => {
          setError("Reset Password has error failed: " + err.message); 
        });

      }

  }

  return (
    <div>
      <nav className="navbar" style={{ height: "12px" }}>
        <img src={logo} alt="Logo" />
      </nav>

        <div className="loginDashboard">

            <div className="resetform resetDisplay">
                <form onSubmit={onFinish}>
                    <div className="HeadingAndCaption">
                       <h3>Reset Password</h3>
                       <span>Enter your new password </span> 
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label email"> Email </label>
                      <input type="email" className="form-control input" id="email"  aria-describedby="emailHelp"  required placeholder="Enter Email" value={values.workEmail} onChange={(e) =>  setValues({ ...values, workEmail: e.target.value })  }/>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label "> New Password </label>
                      <input type="password" className={`form-control  input ${passwordError ? 'is-invalid' : ''}`}  id="password"  aria-describedby="emailHelp"  required placeholder="Enter new password" value={values.password} onChange={(e) =>  setValues({ ...values, password: e.target.value })  }/>
                    </div>

                    <div className="mb-3 div">
                      <label htmlFor="cofirmPassword" className="form-label"> Confirm Password </label>
                      <input  type="password"className={`form-control  input ${passwordError ? 'is-invalid' : ''}`}   id="cofirmPassword"  required placeholder="Enter confirmed password" value={values.confirmPassword} onChange={(e) =>  setValues({ ...values, confirmPassword: e.target.value })  }/>
                    </div>

                    <div className=" buttonGap">
                        {error && <div className="error-message"  style={{fontSize:"12px", fontWeight:"500", color:"red"}}>{error}</div>}
                        <button type="submit" className="resetBtn"> Update Password  </button>
                    </div>

                </form>
            </div>

            
            <div className="imageDiv">
                <img src={pic} alt="pic" style={{height:"auto", width:"100%"}} />
            </div>

        </div>
        


         {/* Error Modal */}
         <Modal show={passwordError} onHide={() => setPasswordError(false)} centered>
            <Modal.Header closeButton >
              <Modal.Title style={{color:"red"}}>Error  ⚠️</Modal.Title>
            </Modal.Header> 

            <Modal.Body style={{color:"rgb(225, 54, 54)"}}>
              {errorMessage} <br/> <br/> 
              <Button style={{float:"right", background:"red"}} variant="secondary" onClick={() => setPasswordError(false)}>
                Close
              </Button>
            </Modal.Body>
        </Modal>
    </div>
  );
}

export default ResetMember;
