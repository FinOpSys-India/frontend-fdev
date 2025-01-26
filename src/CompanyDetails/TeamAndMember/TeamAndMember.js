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

const TeamAndMember = () => {

const[companyMember, setCompanyMember] = useState();
const [searchTerm, setSearchTerm] = useState("");
const [filteredCompanyMember, setFilteredCompanyMember] = useState([]);
const [selectedItem, setSelectedItem] = useState('');
const [showForm, setShowForm] = useState(false);
const [showCSV, setShowCSV] = useState(false);
const [activeButton, setActiveButton] = useState(null)
const role = sessionStorage.getItem('role');
const respectiveRoles = {ApPerson:"Account Payable",Approver1:"Approver One", Approver2:"Approver Two", DepartMentHead:"DepartMent Head"} 

const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName:'',
  //   workEmail: '',
  //   companyName:'',
  //   companyType :'',
  //   phoneNumber:'',
  //   password: '',
  //   role: "Admin",
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };


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


    // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios.post(`${apiEndPointUrl}/signup`, formData)
  //           .then(res => {
  //             console.log(res.data.Status);
  //               if (res.data.Status === 'Successful') { 
  //                 alert("Team member added successfully!");
  //               } else {
  //                   console.log(res.data.Status);
  //               }
  //           })
  //           .catch(err => {
  //               console.error('Signup error:', err);
  //           });
    // Reset form data
  //   setFormData({ firstName: '',
  //     lastName:'',
  //     workEmail: '',
  //     companyName:'',
  //     companyType :'',
  //     phoneNumber:'',
  //     password: '', role: "Admin" });
  //   setShowForm(false);
  // };

// axios.defaults.withCredentials = true;

  useEffect(() => {
    
    // const fetching = async () => {
    //   try {
    //     const res = await axios.get(`${apiEndPointUrl}/get-company-member`);
    //     setCompanyMember(res.data);
    //     console.log("Fetching:", res.data); // Log the response data directly
    //   } catch (error) {
    //     console.error("Error fetching companies:", error);
    //   }
    // };
    // console.log("role:", role); 
    // fetching()
  }, []);

  

  // function companySearchBar(e){

  //   const searchValue = e.target.value;
  //   setSearchTerm(searchValue);
  //   console.log(searchValue);
  
  //   let filtered = [];
  //   if (searchValue) {
  //       filtered = companyMember.filter(company => 
  //       company.firstName.toLowerCase().includes(searchValue.toLowerCase()))
  //   }
  
  //   setFilteredCompanyMember(filtered);
  //   console.log(filtered);
  // }
  
  
  return (
    <>
      <div className="topDiv">
        <p className="teamP">Team </p>

        <div id="teamDropDown">
          <div className="teamSearch"><SearchIcon style={{fontSize:"16.9px",  marginLeft:"9px", marginTop:"6.9px"}}/><input className="but-search"  id="search" onChange={""}  value={searchTerm} placeholder="     Search" /> </div>
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
              {/* <a href="" style={{ marginRight: "10px" }}>
              </a> */}
            <input className="memberInput"/>
            <button className="memberSend">Send Invite</button>
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
               {/* {
                currentItems.map((invoice, index) => ( */}
                  <tr >
                    <td > <input type="checkbox" />{" "} &nbsp;&nbsp;&nbsp; invoice.billId</td>
                    <td>  invoice.vendorName</td>
                    {(role === roles.admin ) ?  <td> l,;l,;</td> :null}
                    <td>mkkmklppp</td>
                    <td> invoice.amount</td>
                  </tr>
                  
                {/* )) */}
               {/* }  */}
          </tbody>
        </Table>
      </div>

      {
          showForm &&
        <div className="modalOverlayInsideTeam">
          <div className="modalContentInsideTeam">
            <ManuallForm  show={showForm}
            onHide={() => setShowForm(false)}/>
          </div>
        </div>
    
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