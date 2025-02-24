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
    status:"Pending"
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
          onHide(); 
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
   
const handleModalClose = () => {
  setShowModal(false);
  onHide(); 
};


  useEffect(()=>{
    console.log("show", )
},[formData])



return (
  <Modal
    show={showModal}
    onHide={handleModalClose}
    size="lg"
    backdrop={false}
    // style={{ width:" 71%"}}
    style={{ marginTop: '3%', width: '41%', marginLeft: '33%' , }}
    scrollable 
    dialogClassName="modal-90w"   
  >
    <Modal.Header closeButton  className="custom-close-btn" style={{background:" rgba(240, 240, 240, 1)  "}}></Modal.Header>
    <Modal.Body style={{background:" rgba(240, 240, 240, 1)  "}}>
      <div className="team-form-step" backdrop={false}>
        <Form onSubmit={sendData}> 
          <Form.Group className="" controlId="workEmail">
            <Form.Label className="team-addingVendor team-vendorcompanyName"> Email Address<span className="team-red">*</span></Form.Label>
            <Form.Control className="team-addingVendor team-vendorcompanyNameInput" type="email" placeholder="Email Address" required value={formData.workEmail} onChange={handleChange} />
          </Form.Group>

          <div className="team-vendorNameDiv">
            <Form.Group className="team-vendorDivs team-vendorNameDiv1" controlId="firstName">
              <Form.Label className="team-addingVendor team-vendorName"> First Name <span className="team-red">*</span></Form.Label>
              <Form.Control className="team-addingVendor team-vendorNameInput" type="text" placeholder="First Name" required value={formData.firstName} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="team-vendorDivs team-vendorNameDiv2" controlId="lastName">
              <Form.Label className="team-addingVendor team-vendorName"> Last Name <span className="team-red">*</span> </Form.Label>
              <Form.Control className="team-addingVendor team-vendorNameInput" type="text" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} />
            </Form.Group>
          </div>

          <Form.Group className="team-vendorDivs" controlId="department">
            <Form.Label className="team-addingVendor team-vendorName"> Department<span className="team-red">*</span> </Form.Label>
            <Form.Control as="select" className="team-addingVendor team-vendorNameInput" required value={formData.department} onChange={handleChange}>
              <option value="">Select department</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="team-vendorDivs" controlId="role">
            <Form.Label className="team-addingVendor team-vendorName"> Position<span className="team-red">*</span></Form.Label>
            <Form.Control as="select" className="team-addingVendor team-vendorNameInput" required value={formData.role} onChange={handleChange}>
              <option value="">Select Position</option>
              <option value="Approver1">Approver1</option>
              <option value="ApPerson">ApPerson</option>
              <option value="DepartMentHead">DepartMentHead</option>
              <option value="Approver2">Approver2</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="team-vendorDivs" controlId="password">
            <Form.Label className="team-addingVendor team-vendorcompanyName"> Password<span className="team-red">*</span> </Form.Label>
            <Form.Control className="team-addingVendor team-vendorcompanyNameInput" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
          </Form.Group>
          
          <div className="team-vendorButtonDiv">
            <button type="submit">Submit</button>
          </div>
        </Form> 

        <ToastContainer />
      </div>
    </Modal.Body> 
  </Modal>
);

}

export default ManuallForm;