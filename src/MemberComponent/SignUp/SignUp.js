import React, { useState } from "react";
import logo from "../../images/FinOpSyslogo.png";
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { apiEndPointUrl } from "../../utils/apiService";

function SignUpMember() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countryCode, setCountryCode] = useState("+1");
  const [values, setValues] = useState({
      firstName: '',
      lastName:'',
      workEmail: '',
      companyName:'',
      memberPosition :'',
      phoneNumber:'',
      password: '',
      confirmPassword:''
  });


  const personalEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com'];

  const validateWorkEmail = (email) => {
    console.log("Validating email:", email);
    if (!email.includes('@')) {
      console.log("Email does not contain @");
      return false;
    }

    const domain = email.split('@')[1];
    console.log("Email domain:", domain);
    const isValid = !personalEmailDomains.includes(domain);
    console.log("Is valid work email:", isValid);
    return isValid;
  };


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






  const onFinish = (e) => {
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
      else if (!validateWorkEmail(values.workEmail)) {
          setErrorMessage('Please enter your work email, not a personal email.');
          setPasswordError(true);
          return;
         }
        else {
        setPasswordError(false);

        const updatedValues = {
          ...values,
          phoneNumber: `${countryCode}${values.phoneNumber}`
        };
        console.log("values"+updatedValues)
        // Sending values to server
        axios.post(`${apiEndPointUrl}/signup-member`, updatedValues)
            .then(res => {
              console.log(res.data.Status);
                if (res.data.Status === 'Successful') { 
                    console.log('Signup successful');
                    navigate('/login-member'); 
                } else {
                    console.log('Signup failed', res.data.Error);
                    console.log(res.data.Status);
                }
            })
            .catch(err => {
                console.error('Signup error:', err);
            });
        }
  };




  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  return (
    <div>
      <nav className="navbar" style={{height:"12px"}}>
        <img src={logo} alt="Logo" />
      </nav>

      
        <div className="row formSignup">
            <form className="row " onSubmit={onFinish}>
              <div className="col-12 signupName">
                <h3>Sign Up</h3>
                <span>Create your new account.</span>
              </div>

              <div className="col-md-6 firstname">
                <label htmlFor="firstname" className="form-label">First Name <span style={{color:"red"}}>*</span> </label>
                <input type="text" className="form-control formDiv" id="firstname" required placeholder="Enter the First Name"  value={values.firstName} onChange={(e) => setValues({ ...values, firstName: e.target.value })}/>
              </div>

              <div className="col-md-6 firstname">
                <label htmlFor="lastname" className="form-label">Last Name <span style={{color:"red"}}>*</span></label>
                <input type="text" className="form-control formDiv" id="lastname"  required placeholder="Enter the Last Name" value={values.lastName} onChange={(e) => setValues({ ...values, lastName: e.target.value })}/>
              </div>

              <div className="col-12">
                <label htmlFor="workemail" className="form-label"> Work Email <span style={{color:"red"}}>*</span></label>
                <input type="email" className="form-control" id="workemail" required placeholder="Enter the Work email" value={values.workEmail} onChange={(e) => setValues({ ...values, workEmail: e.target.value })}/>
              </div>

              <div className="col-md-6">
                <label htmlFor="companyName" className="form-label">Company Name <span style={{color:"red"}}>*</span></label>
                <input type="text" className="form-control formDiv" id="companyName" required placeholder="Enter the Company Name" value={values.companyName} onChange={(e) => setValues({ ...values, companyName: e.target.value })}/>
              </div>

              <div className="col-md-6">
                <label htmlFor="memberPosition" className="form-label"> Position <span style={{color:"red"}}>*</span></label>
                <select id="memberPosition" className="form-select form-control formDiv" style={{height: "29px", fontSize:"12px"}} value={values.memberPosition} onChange={(e) => setValues({ ...values, memberPosition: e.target.value })}>
                  <option defaultValue >Choose...</option>
                  <option>...</option>
                </select>
              </div>


              <div className="col-12">
                  <label htmlFor="phone" className="form-label">Phone Number <span style={{color:"red"}}>*</span></label>
                  <div className="number" style={{marginTop:"-2.3px"}}>
                      <select id="phone" className="form-select form-control countryCode" style={{height: "29px", fontSize:"12px"}} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                          <option defaultValue>{countryCode}</option>
                          <option>+91</option>
                          <option>+1</option>
                        </select>
                     <input type="number" className="form-control" id="phone" required placeholder="Enter the Phone Number"  value={values.phoneNumber} onChange={(e) => setValues({...values, phoneNumber : e.target.value})}/>
                  </div>
               </div>


              <div className="col-12 eyeButton">
                <label htmlFor="password" className="form-label">Password <span style={{color:"red"}}>*</span></label>
                
                <OverlayTrigger placement="right" overlay={
                    <Tooltip id="tooltip-right" aria-label="warning">
                      Password must be 8-16 characters and contain at least one alphabet(A-Z), one number(0-9), and one special character(@#$%^&...)!.
                    </Tooltip>
                    }
                  >
                    <div className="input-group passwordAndEye">
                      <input type={showPassword ? "text" : "password"} className={`form-control ${passwordError ? 'is-invalid' : ''}`} id="password" required placeholder="Enter the Password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
                        <button type="button" className="btn btn-outline-secondary eyeDiv"  onClick={togglePasswordVisibility}>
                          <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"} id="eye" onClick={togglePasswordVisibility}></i>
                        </button>
                    </div>
                </OverlayTrigger>    
              </div>


              <div className="col-12">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password <span style={{color:"red"}}>*</span></label>
                
                <OverlayTrigger placement="right" overlay={
                    <Tooltip id="tooltip-right" aria-label="warning">
                      Password must be 8-16 characters and contain at least one alphabet(A-Z), one number(0-9), and one special character(@#$%^&...)!.
                    </Tooltip>
                    }
                  >
                    <div className="input-group passwordAndEye">
                    <input type={showConfirmPassword ? "text" : "password"} className={`form-control ${passwordError ? 'is-invalid' : ''}`} id="confirmPassword" required placeholder="Enter the Confirmed Password" value={values.confirmPassword} onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} />
                          <button type="button" className="btn btn-outline-secondary eyeDiv"  onClick={toggleConfirmPasswordVisibility}>
                            <i className={showConfirmPassword ? "fas fa-eye" : "fas fa-eye-slash"} id="eye" onClick={toggleConfirmPasswordVisibility}></i>
                          </button>
                    </div>
                </OverlayTrigger>    
              </div>

              <div className="col-12">
                <button type="submit" className=" signupBtn">Sign in</button>

              </div>

              <div className="col-12">
                <Link className="already" to="/login-member">Already have an account ? Login</Link>
              </div>
            </form>
        </div>

          {/* Error Modal */}
        <Modal show={passwordError} onHide={() => setPasswordError(false)} centered>
            <Modal.Header closeButton >
              <Modal.Title style={{color:"red"}}>Error ⚠️</Modal.Title>
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

export default SignUpMember;
