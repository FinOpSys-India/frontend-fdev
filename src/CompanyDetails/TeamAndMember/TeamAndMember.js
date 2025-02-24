import React, { useEffect, useState } from "react";
import "./TeamAndMember.css";
import SearchIcon from '@mui/icons-material/Search';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import axios from "axios"
import { apiEndPointUrl } from "../../utils/apiService";
import dropArrow  from "../../assets/dropArrow.svg"
import plus  from "../../assets/plus.svg"
import { Dropdown, Table } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Modal, ProgressBar } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { roles } from "../../utils/constant";
import ManuallForm from "./ManuallForm/ManuallForm";
import Csv from "./Csv/Csv";

const TeamAndMember = () => {

const[companyMember, setCompanyMember] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [filteredCompanyMember, setFilteredCompanyMember] = useState([]);
const [selectedItem, setSelectedItem] = useState('');
const [showForm, setShowForm] = useState(false);
const [showCSV, setShowCSV] = useState(false);
const [activeButton, setActiveButton] = useState(null)
const role = sessionStorage.getItem('role');
const respectiveRoles = {ApPerson:"Account Payable",Approver1:"Approver One", Approver2:"Approver Two", DepartMentHead:"DepartMent Head"} 
const navigate = useNavigate()

const [status, setStatus] = useState("active");
const [emails, setEmails] = useState([]);
const [currentInput, setCurrentInput] = useState("");


 //  -------------- dropdown-------------
     const handleSelect = (eventKey) => {
      setSelectedItem(eventKey);
    };

    const enterManually = () => {
      setShowForm(true)
    };

    const uploadCsv = () => {
      setShowCSV(true)
    };

    const handleCloseModal = () => {
      setShowCSV(false);
      setShowForm(false);  // Close the form if open
    };

    const handleCloseForm = () => {
      setShowCSV(false);
      setShowForm(false);  // Close the form if open
    };


    const handleSend = () => {
       console.log("email", emails)

      axios.post(`${apiEndPointUrl}/send-invite`, emails)
        .then(res => {
          console.log(res.data.message);
          toast.success(res.data.message);
          setEmails(""); 
        })
        .catch(err => {
            console.error('send-invite error:', err);
        });
    }

const handleSearch = () => {
  if (searchTerm.trim() === "") {
    setFilteredCompanyMember(companyMember); // Reset to full list if empty search
    return;
  }

  const filtered = companyMember.filter((member) => {
    // Ensure values are not undefined before calling `toLowerCase()`
    const email = member.WORKEMAIL ? member.WORKEMAIL.toLowerCase() : "";
    const firstName = member.firstName ? member.firstName.toLowerCase() : "";
    const lastName = member.lastName ? member.lastName.toLowerCase() : "";
    const companyName = member.companyName ? member.companyName.toLowerCase() : "";

    return (
      email.includes(searchTerm.toLowerCase()) ||
      firstName.includes(searchTerm.toLowerCase()) ||
      lastName.includes(searchTerm.toLowerCase()) ||
      companyName.includes(searchTerm.toLowerCase())
    );
  });

  setFilteredCompanyMember(filtered);
};


const handleDepartmentChange = (memberId, value) => {
  console.log("setDepartment",  value, memberId)

  axios.post(`${apiEndPointUrl}/update-department`, {
    memberId, value
  })
  .then(res => {
    console.log(res.data.message);
    toast.success(res.data.message); 
  })
  .catch(err => {
      console.error('update-department error:', err);
  });

};

const handleRoleChange = (memberId, value) => {
  console.log("setDepartment",  value, memberId)

  axios.post(`${apiEndPointUrl}/update-role`, {
    memberId, value
  })
  .then(res => {
    console.log(res.data.message);
    toast.success(res.data.message); 
  })
  .catch(err => {
      console.error('update-role error:', err);
  });
};

  useEffect(() => {
    
    const fetching = async () => {
      try {
        const res = await axios.get(`${apiEndPointUrl}/get-signup-details`);
        setCompanyMember(res.data);
        setFilteredCompanyMember(res.data);
        console.log("Fetching:", res.data); 
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }; 
    fetching()
  }, [emails]);

  


  const handleInputChange = (e) => {
    const emailList = e.target.value.split(" ").filter((email) => email); 
    setEmails(emailList); 
  };
  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="topDiv">
        <p className="teamP">Team </p>

        <div id="teamDropDown">
          <div className="teamSearch"><SearchIcon style={{fontSize:"16.9px",  marginLeft:"9px", marginTop:"6.9px"}}/><input className="but-search"  id="search"  value={searchTerm}onChange={(e) => {setSearchTerm(e.target.value); handleSearch()}} placeholder="     Search" /> </div>
          <Dropdown onSelect={handleSelect} >
            <Dropdown.Toggle  id="" className="teamDropDown">
            <p><img src={plus} style={{width:"12.9%" }}/> &nbsp; Add Member</p> 
            </Dropdown.Toggle>
            <Dropdown.Menu className='teamDropdownItem'  style={{ width: '10px' }}>
              <Dropdown.Item className='teamDropdownEachItem' eventKey="Enter Manually" onClick={enterManually}>Enter Manually</Dropdown.Item>
              <Dropdown.Item className='teamDropdownEachItem' eventKey="Upload CSv" onClick={uploadCsv}>Upload CSv</Dropdown.Item>
              {/* {(role != roles.approver1 && role !==roles.approver2)?<Dropdown.Item className='billDropdownEachItem' eventKey="All Bills" onClick={() => handleButtonClick('all-Bills')}>All Bills</Dropdown.Item>:null} */}
            </Dropdown.Menu>
          </Dropdown>    
        </div>
      </div>

     { 
        role === roles.admin  
              ?
      <div className="inviteTeamSection">
          <p className="heading">Invite Your Team</p>
          <p className="para">Send an invitation to your team members. Send directly via email  or copy link. </p>
          
          <div className="memberInvitation">
              {/* <a href="" style={{ marginRight: "10px" }}>mjnkkjs</a> */}
            <div className="email-container">
              <div className="email-list">   
                 {Array.isArray(emails) && emails.map((email, index) => ( // Ensure emails is an array
                    <div key={index} className="email-pill">
                        {email}
                      <span className="close-btn" onClick={() => removeEmail(index)}>✕</span>
                    </div>
                  ))}
             <input className="memberInput hidden-value" type="text"  placeholder="" onChange={handleInputChange}/>
         
            </div>
           </div>

            <button className="memberSend" onClick={handleSend}>Send Invite</button>
          </div>
      </div>
        :
        null
    }


      <div className=" tableMembersInfo mt-3 d-flex flex-column align-items-center ">
        <Table className="custom-width">
          <thead>
            <tr>
              <th> <input type="checkbox"  />   &nbsp;&nbsp;&nbsp; Name</th>
              <th>Email</th>
               {(role === roles.admin ) ? <th>Department <img src={dropArrow} style={{width:"12%" }}/> </th>:null}
               <th>Role <img src={dropArrow} style={{width:"12.9%" }}/> </th>
              <th>Invite Status</th>
            </tr>
          </thead>
          <tbody>
            {
              companyMember && filteredCompanyMember.length > 0 ?
              filteredCompanyMember.map((member, index) => (
                  <tr key={member.ID}>
                    <td > <input type="checkbox" />{" "} &nbsp;&nbsp;&nbsp;{member.WORKEMAIL}</td>
                    <td>{member.WORKEMAIL}</td>
                    {(role === roles.admin ) ?
                    <td>
                      <select className="team-form-select" value={member.DEPARTMENT || ""}  onChange={(e) => handleDepartmentChange(member.ID, e.target.value)}>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>  
                      </select>
                    </td>
                          :null
                    }
                    <td>
                    <select  className="team-form-select select"  value={member.ROLE} onChange={(e) => handleRoleChange(member.ID, e.target.value)}>
                      <option value="Approver1">Approver 1</option>
                      <option value="APPerson">AP Person</option>
                      <option value="DepartmentHead">Department Head</option>
                      <option value="Approver2">Approver 2</option>
                      <option value="Admin">Admin</option>
                      </select>
                    </td>

                    <td > <span className={`status-dropdown-${member.STATUS}`} onChange={(e) => setStatus(e.target.value)}> {member.STATUS} </span></td>
                  </tr>
                  
                 )):""
                }  
          </tbody>
        </Table>
      </div>

      {
          showForm &&
        <div  className={showForm ? "modalOverlayInsideTeam" : ""}>
          {/* <div className="modalContentInsideTeam"> */}
            <ManuallForm  show={showForm}
            onHide={() => setShowForm(false)}/>
          {/* </div> */}
        </div>
    
      }

      {
          showCSV === true ?
        <div className={showCSV ? "modalOverlayInsideTeam" : ""}>
            <Csv  show={showCSV}
            onHide={handleCloseModal}/>
        
         </div>:""
    
      }

    </>
  );
};

export default TeamAndMember;



// {
//   companyMember  && companyMember.length > 0
//                   ?
//   companyMember.map((member, index) => (   
//       <div className="membersRow"  key={member.eid} >
//         <div className="picNameProfile">
//           <DragIndicatorIcon  style={{fontSize:"12px", marginLeft:"1px"}}/> 
//           <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/> 
//           <p >  {member.firstName} </p>
//         </div>
        
//         <p className="profileEmail"> {member.workEmail} </p>
        
//         <div className="roleAndToggle">
//             <select name="" id="role" defaultValue={member.memberPosition}>
//             <option value={member.memberPosition}>{member.memberPosition }</option>
//             <option value="cfo">Chief Finance Officer</option>
//             <option value="cfo">Chief Finance Officer</option>
//             </select>

//             <div className='profileToggle '>
//                 <div className='toggleDivProfile'>
//                         <div class="form-check form-switch toggleProfile" >
//                             <input class="form-check-input profileToggle" type="checkbox" id="flexSwitchCheckDefault" />
//                         </div>
//                 </div>
//             </div>
//         </div>
        
//         <div className="actionHeader">
//           <div></div>
//           <div style={{ marginRight: "20px" }}>
//             <i class="fas fa-pencil-alt"></i>
//           </div>
//         </div>
//       </div>
//   ))
   
//                : 
//   // filteredCompanyMember.length > 0 
//   //          ? 
//   //    filteredCompanyMember.map((member, index) => (   
//   //     <div className="membersRow"  key={member.eid} >
//   //       <div className="picNameProfile">
//   //         <DragIndicatorIcon  style={{fontSize:"12px", marginLeft:"1px"}}/> 
//   //         <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/> 
//   //         <p >  {member.firstName} </p>
//   //       </div>
        
//   //       <p className="profileEmail"> {member.workEmail} </p>
        
//   //       <div className="roleAndToggle">
//   //           <select name="" id="role" defaultValue={member.memberPosition}>
//   //           <option value={member.memberPosition}>{member.memberPosition }</option>
//   //           <option value="cfo">Chief Finance Officer</option>
//   //           <option value="cfo">Chief Finance Officer</option>
//   //           </select>

//   //           <div className='profileToggle '>
//   //               <div className='toggleDivProfile'>
//   //                       <div class="form-check form-switch toggleProfile" >
//   //                           <input class="form-check-input profileToggle" type="checkbox" id="flexSwitchCheckDefault" />
//   //                       </div>
//   //               </div>
//   //           </div>
//   //       </div>
        
//   //       <div className="actionHeader">
//   //         <div></div>
//   //         <div style={{ marginRight: "20px" }}>
//   //           <i class="fas fa-pencil-alt"></i>
//   //         </div>
//   //       </div>
//   //     </div>
//   // ))
//       // :
//     //  <p>No Data Found</p> 
// // }