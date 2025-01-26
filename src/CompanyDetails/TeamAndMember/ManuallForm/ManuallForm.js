import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./ManuallForm.css";
import { apiEndPointUrl } from "../../../utils/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import axios from "axios";


function ManuallForm({ show, onHide }) {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(show);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    role: "",
    department: "",
    password: "",
  });


axios.defaults.withCredentials = true;
  
// Handle input changes
const handleChange = (e) => {
  console.log(e.target.value)
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
 


  async function sendData(){
     
  console.log("se", formData)
 
  axios.post(`${apiEndPointUrl}/signup`, formData)
    .then(res => {
      console.log(res.data.Status);
        if (res.data.Status === 'Successful') { 
          toast.success("Team member added successfully!", { autoClose: 1500 });
        } else {
            console.log(res.data.Status);
        }
    })
    .catch(err => {
        console.error('Signup error:', err);
    });

    setFormData({
      firstName: "",
      lastName: "",
      workEmail: "",
      role: "",
      department: "",
      password: "",
    });
  
  }
   
  useEffect(()=>{

    console.log("show", )
 
},[formData])

  return (
    <div className="form-step">
      <Form onSubmit={sendData}> 
        <Form.Group className="" controlId="workEmail">
          <Form.Label className="addingVendor vendorcompanyName"> Email Address<span className="red">*</span></Form.Label>
          <Form.Control className="addingVendor vendorcompanyNameInput"  type="email" placeholder="Email Address"  required value={formData.workEmail} onChange={handleChange} />
        </Form.Group>
    
        <div className="vendorNameDiv">
          <Form.Group className="vendorDivs" controlId="firstName">
            <Form.Label className="addingVendor vendorName"> First Name <span className="red">*</span></Form.Label>
            <Form.Control className="addingVendor vendorNameInput" type="text" placeholder="First Name" required value={formData.firstName}  onChange={handleChange}/>
          </Form.Group>
    
          <Form.Group className="vendorDivs" controlId="lastName">
            <Form.Label className="addingVendor vendorName"> Last Name <span className="red">*</span> </Form.Label>
            <Form.Control className="addingVendor vendorNameInput" type="text" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} />
          </Form.Group>
        </div>
    
        <Form.Group className="vendorDivs" controlId="department">
          <Form.Label className="addingVendor vendorName"> Department<span className="red">*</span> </Form.Label>
          <Form.Control as="select" className="addingVendor vendorNameInput"  required value={formData.department}  onChange={handleChange} >
            <option value="">Select department</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </Form.Control>
        </Form.Group>
    
        <Form.Group className="vendorDivs" controlId="role">
          <Form.Label className="addingVendor vendorName"> Position<span className="red">*</span></Form.Label>
          <Form.Control  as="select" className="addingVendor vendorNameInput" required value={formData.role}  onChange={handleChange}>
            <option value="">Select Position</option>
            <option value="Approver1">Approver1</option>
            <option value="ApPerson">ApPerson</option>
            <option value="DepartMentHead">DepartMentHead</option>
            <option value="Approver2">Approver2</option>
          </Form.Control>
        </Form.Group>
    
      <Form.Group className="" controlId="password">
        <Form.Label className="addingVendor vendorcompanyName"> Password<span className="red">*</span> </Form.Label>
        <Form.Control className="addingVendor vendorcompanyNameInput" type="password" placeholder="Password"  required  value={formData.password} onChange={handleChange} />
      </Form.Group>
      
      <div className="vendorButtonDiv">
        <button type="submit">Submit</button>
      </div>
    </Form> 

   
     <ToastContainer />
  </div>
  
);

}

export default ManuallForm;