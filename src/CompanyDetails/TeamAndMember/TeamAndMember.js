import React, { useEffect, useState } from "react";
import "./TeamAndMember.css";
import SearchIcon from '@mui/icons-material/Search';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import axios from "axios"

const TeamAndMember = () => {

const[companyMember, setCompanyMember] = useState();
const [searchTerm, setSearchTerm] = useState("");
const [filteredCompanyMember, setFilteredCompanyMember] = useState([]);



// axios.defaults.withCredentials = true;

useEffect(() => {
  const fetching = async () => {
    try {
      const res = await axios.get("http://localhost:9000/get-company-member");
      setCompanyMember(res.data);
      console.error("fetching", { companyMember });
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  fetching();
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
        <p>Team</p>
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

        <div className="memberInvitation">
          <input  className="button-search" type="search"  id="search" />
          <button className="send-invite-button">Send Invite</button>
        </div>
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
                      <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg" alt="default-avatar"/> 
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
                      <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"  alt="default-avatar"/> 
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