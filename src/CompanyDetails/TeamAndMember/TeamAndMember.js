import React, { useEffect, useState } from "react";
import "./TeamAndMember.css";
import SearchIcon from '@mui/icons-material/Search';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import axios from "axios"
import { apiEndPointUrl } from "../../utils/apiService";

const TeamAndMember = () => {

const[companyMember, setCompanyMember] = useState();
const [searchTerm, setSearchTerm] = useState("");
const [filteredCompanyMember, setFilteredCompanyMember] = useState([]);

const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName:'',
    workEmail: '',
    companyName:'',
    companyType :'',
    phoneNumber:'',
    password: '',
    role: "Admin",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${apiEndPointUrl}/signup`, formData)
            .then(res => {
              console.log(res.data.Status);
                if (res.data.Status === 'Successful') { 
                  alert("Team member added successfully!");
                } else {
                    console.log(res.data.Status);
                }
            })
            .catch(err => {
                console.error('Signup error:', err);
            });
    // Reset form data
    setFormData({ firstName: '',
      lastName:'',
      workEmail: '',
      companyName:'',
      companyType :'',
      phoneNumber:'',
      password: '', role: "Admin" });
    setShowForm(false);
  };

// axios.defaults.withCredentials = true;

  useEffect(() => {
    
    const fetching = async () => {
      try {
        const res = await axios.get(`${apiEndPointUrl}/get-company-member`);
        setCompanyMember(res.data);
        console.log("Fetching:", res.data); // Log the response data directly
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    
    fetching()
  }, []);

  

  function companySearchBar(e){

    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    console.log(searchValue);
  
    let filtered = [];
    if (searchValue) {
        filtered = companyMember.filter(company => 
        company.firstName.toLowerCase().includes(searchValue.toLowerCase()))
    }
  
    setFilteredCompanyMember(filtered);
    console.log(filtered);
  }
  
  
  return (
    <>
      <div className="topDiv">
        <p>Team {}</p>
          <SearchIcon style={{fontSize:"16.9px", position:"absolute", marginLeft:"630px", marginTop:"6px"}}/> <input className="but-search"  id="search" onChange={companySearchBar}  value={searchTerm} placeholder="Search" />
      </div>

      <div className="inviteTeamSection">
        <div>
          <p className="heading">Invite Your Team</p>
          <div className="invitationLine">
            <p className="para">
              Send an invitation to your team members. Send directly via email
              or copy link.
            </p>
            <div style={{ marginLeft: "30px" }}>
              <a href="" style={{ marginRight: "10px" }}>
                {/* <Link /> Copy Link */}
              </a>
            </div>
          </div>
        </div>
</div>
        <div className="memberInvitation">
          {!showForm ? 
        <button
          className="send-invite-button"
          onClick={() => setShowForm(true)}
        >
          Add Team Member
        </button>
       : 
        <form className="add-team-member-form" onSubmit={handleSubmit}>
          
            <div className="email-password-teamMember">
            <div className="emailForTeamMemberDiv">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="emailForTeamMember"
              name="workEmail"
              value={formData.workEmail}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="emailForTeamMemberDiv">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="passwordForTeamMember"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          </div>
          <div className="phoneNumber-role-teamMember">

          <div className="phoneNumberForTeamMemberDiv">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumberForTeamMember"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="emailForTeamMemberDiv">
            <label htmlFor="role">Role Name:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="Admin">Admin</option>
              <option value="Approver1">Approver1</option>
              <option value="Approver2">Approver2</option>
              <option value="Department Head">Department Head</option>
              <option value="ApPerson">ApPerson</option>
            </select>
          </div>
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </form>
      }
    </div>


      <div className="tableMembersInfo">
          <div className="head">
            <p style={{ marginLeft: "10px" }}>Name</p>
            <p>Details</p>
            <p>Role</p>
            <p style={{ marginRight: "10px" }}>Action</p>
          </div>

          {
              searchTerm.length === 0
                       ?
              companyMember  && companyMember.length > 0
                              ?
              companyMember.map((member, index) => (   
                  <div className="membersRow"  key={member.eid} >
                    <div className="picNameProfile">
                      <DragIndicatorIcon  style={{fontSize:"12px", marginLeft:"1px"}}/> 
                      <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/> 
                      <p >  {member.firstName} </p>
                    </div>
                    
                    <p className="profileEmail"> {member.workEmail} </p>
                    
                    <div className="roleAndToggle">
                        <select name="" id="role" defaultValue={member.memberPosition}>
                        <option value={member.memberPosition}>{member.memberPosition }</option>
                        <option value="cfo">Chief Finance Officer</option>
                        <option value="cfo">Chief Finance Officer</option>
                        </select>

                        <div className='profileToggle '>
                            <div className='toggleDivProfile'>
                                    <div class="form-check form-switch toggleProfile" >
                                        <input class="form-check-input profileToggle" type="checkbox" id="flexSwitchCheckDefault" />
                                    </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="actionHeader">
                      <div></div>
                      <div style={{ marginRight: "20px" }}>
                        <i class="fas fa-pencil-alt"></i>
                      </div>
                    </div>
                  </div>
              ))
                      : 
                <p>No Data Found</p>
               
                        : 
              filteredCompanyMember.length > 0 
                       ? 
                 filteredCompanyMember.map((member, index) => (   
                  <div className="membersRow"  key={member.eid} >
                    <div className="picNameProfile">
                      <DragIndicatorIcon  style={{fontSize:"12px", marginLeft:"1px"}}/> 
                      <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/> 
                      <p >  {member.firstName} </p>
                    </div>
                    
                    <p className="profileEmail"> {member.workEmail} </p>
                    
                    <div className="roleAndToggle">
                        <select name="" id="role" defaultValue={member.memberPosition}>
                        <option value={member.memberPosition}>{member.memberPosition }</option>
                        <option value="cfo">Chief Finance Officer</option>
                        <option value="cfo">Chief Finance Officer</option>
                        </select>

                        <div className='profileToggle '>
                            <div className='toggleDivProfile'>
                                    <div class="form-check form-switch toggleProfile" >
                                        <input class="form-check-input profileToggle" type="checkbox" id="flexSwitchCheckDefault" />
                                    </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="actionHeader">
                      <div></div>
                      <div style={{ marginRight: "20px" }}>
                        <i class="fas fa-pencil-alt"></i>
                      </div>
                    </div>
                  </div>
              ))
                      :
                 <p>No Data Found</p> 
          }

      </div>
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