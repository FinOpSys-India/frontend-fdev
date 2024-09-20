import React, { useEffect, useState } from 'react'
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import "./AccessControl.css"
import SearchIcon from '@mui/icons-material/Search';
import Demo from '../Demo/Demo';
import axios from "axios"

function AccessControl() {

    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false); // State to track search mode
    const [isCheckedNotification, setIsCheckedNotification] = useState({
           generalAccess: "",
           notification:"",
           page1:""
        }
    );
    // const [isCheckedGeneralAccess, setIsCheckedGeneralAccess] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setIsChecked(false); // Reset isChecked state
        setIsSearchMode(!isSearchMode); // Toggle search mode
    };


    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    };


useEffect(()=>{

    console.log(isCheckedNotification)

    axios.post('http://localhost:9000/update-notification', isCheckedNotification, { withCredentials: true })
    .then(response => {
        console.log(response.data);
        console.log(response.data.message);
        console.log(response.data.isCheckedNotification);
    })
    .catch(error => {
        console.error('Error sending notification status', error);
    });

},[isCheckedNotification])

  return (
    <div>

        <nav className='accessNav'>
            <span>Access Control</span>
            <div className='dropdown' >
                <button className="btn dropdown-toggle " type="button"   id="dropdownMenuButton1"  onClick={toggleDropdown}  aria-expanded={isOpen ? 'true' : 'false'}> Search Members</button>
                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton1">
                   <div className='searchBarAccess'> {}<SearchIcon style={{fontSize: 16,  marginTop:"6px" , marginLeft:"9px"}}/></div>
                    {

                        <li><a className="dropdown-item" href="#">Action</a></li>
                    }
                </ul>
            </div>
        </nav>

        <div className='accessBox'>
               <div className='settingNameAndButtons'>
                  <h5 >General Access</h5>
                  <div className='toggleAndReset '>
                       <div className='toggleDiv'>
                            <div class="form-check form-switch toggle" >
                                    <input class="form-check-input" data-testid="general-access-switch" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "15px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }}  checked={isCheckedNotification.generalAccess}  onChange={(e) =>  setIsCheckedNotification({ ...isCheckedNotification, generalAccess: !isCheckedNotification.generalAccess})  } />
                            </div>
                       </div>

                        <div className='resetDiv'>
                            <span> <RotateLeftIcon style={{ fontSize: 16}}/> Reset1</span>
                        </div>
                  </div>
               </div>


               <div className='mainDiv'>
                   
                    <div className='accessControlDiv'>
                        <div className='accessControlInfo'>
                            <h6>Notification </h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span> {isCheckedNotification.notification  ? "Active" : "Inactive"} </span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input"  data-testid="notification-switch" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isCheckedNotification.notification}  onChange={(e) =>  setIsCheckedNotification({ ...isCheckedNotification, notification: !isCheckedNotification.notification })  } />
                                    </div>
                               </div>
                             {/* <div style={{display:"none"}}><Demo isCheckedNotification={isCheckedNotification}  onChange={(e) =>  setIsCheckedNotification({ ...isCheckedNotification, notification: e.target.value })  }/> </div>  */}
                        </div>



                        <div className='accessControlInfo'>
                            <h6>Page 1 </h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span>{isCheckedNotification.page1  ? "Active" : "Inactive"} </span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }}  checked={isCheckedNotification.page1}  onChange={(e) =>  setIsCheckedNotification({ ...isCheckedNotification, page1: !isCheckedNotification.page1 })  }/>
                                    </div>
                               </div>
                        </div>
                       


                        <div className='accessControlInfo'>
                            <h6>Page 2</h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span>Active</span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isChecked} onChange={toggleSwitch}/>
                                    </div>
                               </div>
                        </div>


                        <div className='accessControlInfo'>
                            <h6>Page 4</h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span>Active</span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isChecked} onChange={toggleSwitch}/>
                                    </div>
                               </div>
                        </div>

                     </div>

                </div>
        </div>





        <div className='accessBox'>
               <div className='settingNameAndButtons'>
                  <h5 >Account Payable</h5>
                  <div className='toggleAndReset '>
                       <div className='toggleDiv'>
                            <div class="form-check form-switch toggle" >
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "15px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isChecked} onChange={toggleSwitch}/>
                            </div>
                       </div>

                        <div className='resetDiv'>
                            <span> <RotateLeftIcon style={{ fontSize: 16}}/> Reset</span>
                        </div>
                  </div>
               </div>


               <div className='mainDiv'>
                   
                    <div className='accessControlDiv'>
                        <div className='accessControlInfo'>
                            <h6>Page </h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span>Active</span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isChecked} onChange={toggleSwitch}/>
                                    </div>
                               </div>
                        </div>




                        <div className='accessControlInfo'>
                            <h6>Page </h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span>Active</span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isChecked} onChange={toggleSwitch}/>
                                    </div>
                               </div>
                        </div>



                        <div className='accessControlInfo'>
                            <h6>Page </h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span>Active</span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isChecked} onChange={toggleSwitch}/>
                                    </div>
                               </div>
                        </div>


                        <div className='accessControlInfo'>
                            <h6>Page </h6>
                            <span className='accessSpan'>We need to write two line short description about a tool.</span>
                        </div>

                        <div className='accessControlToggle toggleAndReset'>
                               <span>Active</span>
                               <div className='toggleDiv'>
                                    <div class="form-check form-switch toggle" > 
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" style={{ width: "30px", height: "15px", backgroundColor: isChecked ? 'rgba(22, 163, 74, 1)' : '' }} checked={isChecked} onChange={toggleSwitch}/>
                                    </div>
                               </div>
                        </div>

                     </div>

                </div>
        </div>




    </div>
  )
}

export default AccessControl

