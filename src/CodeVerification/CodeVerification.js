import React, { useState } from "react";
import logo from "./../images/FinOpSyslogo.png";
import pic from "./../images/Dashboard.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CodeVerification.css"

function CodeVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [sendAgain, setSendAgain] = useState(null);
    const [phone, setPhone] = useState(0);
    const [values, setValues] = useState({
        phoneNumber : location.state,
        otp: "",

    });



     const onSubmitForm = (e) => {
        e.preventDefault();

        console.log(values)
        //  Sending values to server
       axios
        .post("http://localhost:9000/login", values, { withCredentials: true })
        .then((res) => {
            console.log("res" + res.data);

            setPhone(res.data.phoneNumber);
            if (res.data.Status === "OTP verified successfully") {
                
            localStorage.setItem('user', JSON.stringify(values.phoneNumber));
                console.log("Login successful");
                navigate("/");
            } 
            else {
                console.log("Login failed: ", res.data.Error);
                setError("Otp not matched"); // Set error state with the error message
            }
        })
        .catch((err) => {
            console.error("Login error: ", err);
            // setError("Login failed: " + err.message); // Set error state with the error message
        });
    };


    function GetOtpAgain(e){
        e.preventDefault();
        axios
        .post("http://localhost:9000/send-again", values, { withCredentials: true })
        .then((res) => {
            console.log(res.data)
            setPhone(res.data.phoneNumber);
            console.log({phone})
          if (res.data.message === "OTP sent successfully!") {
            console.log("otp send again successful");

            setSendAgain("Otp sent successfully !")
          } else {
            console.log("Login failed: ", res.data.Error);
            setError("Otp not matched"); // Set error state with the error message
          }
        })
        .catch((err) => {
          console.error("Login error: ", err);
        //   setError("Login failed: " + err.message); // Set error state with the error message
        });
    }


    return (
        <div>
            <nav className="navbar" style={{ height: "12px" }}>
                <img src={logo} alt="Logo" />
            </nav>

            <div className="loginDashboard">
                <div className="otpform">
                    <form onSubmit={onSubmitForm}>
                        <div>
                            <h3>Enter Verification Code</h3>
                            <span>A code sent to {values.phoneNumber}</span>
                        </div>

                        <div className="mb-3 otpBoxDiv" style={{paddingTop:"9%"}}>
                            {/* <input type="text" className="form-control" id="otp" value={values.otp} onChange={(e) =>  setValues({ ...values, otp: e.target.value })} required /> */}
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="otpBox"
                                    style={{ width: "10%", marginRight: "5px" }}
                                    value={values.otp[index] || ""}
                                    onChange={(e) => {
                                        const otpArray = values.otp.split('');
                                        otpArray[index] = e.target.value;
                                        setValues({ ...values, otp: otpArray.join('') });
                                    }}
                                    maxLength={1}
                                    required
                                />
                            ))}
                        </div>


                        <div className="div resend">
                            <span to="/reset" className="notRecieve">Don't receive code ?     &nbsp;&nbsp;&nbsp;</span>
                            <Link to="#" className="sendAgain " onClick={GetOtpAgain}>  Send Again</Link>
                        </div>



                        <div className="button" style={{paddingTop:"6%"}}>
                             {error && <div className="error-message"  style={{fontSize:"12px", fontWeight:"500", color:"red"}}>{error}</div>}
                             {sendAgain && <div className="error-message"  style={{fontSize:"12px", fontWeight:"500", color:"green", paddingLeft:"2%", paddingBottom:"3%", marginTop:"2%"}}>{sendAgain}</div>}
                            <button type="submit" id="submit">Submit</button>
                        </div>
                    </form>
                </div>

                <div className="imageDiv">
                    <img src={pic} alt="pic" style={{ height: "auto", width: "100%" }} />
                </div>
            </div>

            {/* {auth && <h3>You are authorized: {name}</h3>} */}
        </div>
    );
}

export default CodeVerification;


// import React, { useState } from "react";
// import axios from "axios";

// function CodeVerification() {
//     const [otp, setOtp] = useState("");

//     const onSubmitForm = (e) => {
//         e.preventDefault();

//         axios.post("http://localhost:9000/login", { workEmail: "user@email.com", password: "password" })
//             .then(response => {
//                 console.log(response.data);
//                 // Handle success, navigate to next page or show success message
//             })
//             .catch(error => {
//                 console.error('Login error:', error);
//                 // Handle error, show error message to user
//             });
//     };

//     return (
//         <div>
//             <form onSubmit={onSubmitForm}>
//                 <label htmlFor="otp">Enter OTP:</label>
//                 <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// }

// export default CodeVerification;



