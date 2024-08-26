
import React from "react";
import logo from "./../../images/FinOpSyslogo.png";
import { useNavigate } from "react-router-dom";
import "./success.css";

function MemberUpdateSuccessfully() {


    const navigate = useNavigate(); 

      function onSubmit(e){
        // e.preventDefault();
        navigate('/login-member');
      }


  return (

    
       <div className="updated">
           <nav className="nav" style={{ height: "12px" }}>
              <img src={logo} alt="Logo" />
            </nav>

            <div className="navigateDiv" onClick={onSubmit}>
                <div>
                    <h3>Password updated</h3>
                    <span>Your password has been successfully updated .</span> 
                </div>

                <div className="backToLogin">
                      <button className="go">Continue to Login</button>
                </div>  
                    
            </div>
        </div>

  )
}

export default MemberUpdateSuccessfully
// 