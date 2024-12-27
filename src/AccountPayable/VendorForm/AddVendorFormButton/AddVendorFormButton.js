import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./AddVendorFormButton.css";
import { apiEndPointUrl } from "../../../utils/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import axios from "axios";


function AddVendorFormButton({ show, onHide }) {
  const [step, setStep] = useState(1);
  const [contactDetails, setcontactDetails] = useState({
    firstName:"",
    lastName:"",
  });
  const [numberDetail, setnumberDetail] = useState({
    code:"",
    number:""

  });
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    einNumber: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    accountHolderName: "",
    bankName: "",
    bankAddress:"",
    accountType: "",
    accountNumber: "",
    confirmAccountNumber:"",
    swiftCode: "",
  });


   // Handle input changes
   const handlecontactDetails = (e) => {
    const { id, value } = e.target;
    setcontactDetails((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };



    // Handle input changes
    const handlNumberDetails = (e) => {
      const { id, value } = e.target;
      setnumberDetail((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    };
  
      // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log(`Field: ${id}, Value: ${value}`);
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };
 

const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.companyName &&
          formData.contactPerson &&
          formData.phoneNumber &&
          formData.email &&
          formData.einNumber
        );
      case 2:
        return (
          formData.streetAddress1 &&
          formData.city &&
          formData.state &&
          formData.zipCode &&
          formData.country
        );
      case 3:
        return (
          formData.accountHolderName &&
          formData.bankName &&
          formData.accountType &&
          formData.accountNumber &&
          formData.confirmAccountNumber &&
          formData.swiftCode
        );
      default:
        return false;
    }
  };

  
   const  isAccountVaild =()=>{

    if(formData.confirmAccountNumber === formData.accountNumber){
      return formData
    }
    else{
      alert("AccountNumber are not matching")
    }

   }
   const handleNext = async() => {

    if(step===1){
      setFormData((prevData) => ({
       ...prevData,
       contactPerson: contactDetails.firstName + " " + contactDetails.lastName,
       phoneNumber: numberDetail.code + numberDetail.number,
     }));

     console.log(formData)
   }
    if (isStepValid()) {
        if (step <3 )
        setStep(step + 1);
      } 
      else {
        alert("Please fill out all required fields before proceeding.");
      }
  };



  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };


  // --------------------reset---------------------------
   const resetData=()=>{
    setFormData({
      companyName: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      einNumber: "",
      streetAddress1: "",
      streetAddress2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      accountHolderName: "",
      bankName: "",
      bankAddress:"",
      accountType: "",
      accountNumber: "",
      confirmAccountNumber:"",
      swiftCode: "",
    })

    setcontactDetails({
    firstName:"",
    lastName:"",
    });

    setnumberDetail({
    code:"",
    number:""
    })

  }



  async function sendData(){
     
    if (isStepValid()) {

      if(isAccountVaild()){
        console.log("se", formData)
        try {
            const response = await axios.post(`${apiEndPointUrl}/adding-vendor`, formData, {
                withCredentials: true}
            )
            console.log("response", response)
            setFormData("")
            if(response.status == 200) {
              toast.success('vendor added successfully approved', { autoClose: 3000 });
               resetData()
            }
        } catch (error) {
            console.log("Error in vendor :", error.response.data.message);
            toast.error(`${error.response.data.message}`);
        }
      }
    }
    else {
        alert("Please fill out all required fields before proceeding.");
      }
  
  }
   

  
 
  useEffect(()=>{

    if (step === 1) {
        setFormData((prevData) => ({
         ...prevData,
         contactPerson: contactDetails.firstName + " " + contactDetails.lastName,
         phoneNumber: numberDetail.code + numberDetail.number,
       }));
  
  }
},[formData])

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <Form>
              <Form.Group className="" controlId="companyName" > 
                <Form.Label  className="addingVendor vendorcompanyName ">Company Name <span className="red">*</span> </Form.Label>
                <Form.Control  className=" addingVendor vendorcompanyNameInput" type="text" placeholder="Enter company name" required value={formData.companyName}
                  onChange={handleChange}/>
              </Form.Group>

              <Form.Group className="vendorDivs" controlId="contactPerson">
                <Form.Label  className=" addingVendor vendorName" >Primary Contact Person <span className="red">*</span> </Form.Label>
                  <div className="vendorNameDiv">
                    <Form.Control  id="firstName" className=" addingVendor vendorNameInput"  type="text" placeholder="First Name" required value={contactDetails.firstName}
                      onChange={handlecontactDetails}/>
                    <Form.Control   id="lastName"  className=" addingVendor vendorNameInput"  type="text" placeholder="Last Name" required   value={contactDetails.lastName}
                      onChange={handlecontactDetails}/>
                  </div>
              </Form.Group>

              <Form.Group className="vendorDivs" controlId="phoneNumber">
                <Form.Label  className=" addingVendor" >Phone Number <span className="red">*</span> </Form.Label>
                  <div className="vendorPhoneNumberDiv">
                    <Form.Select   id="code" value={numberDetail.code}  required  className="vendorCode addingVendor" onChange={handlNumberDetails} >
                        <option value="+1">+1 </option>
                        <option value="+91">+91 </option>
                        <option value="+44">+44 </option>
                        <option value="+61">+61</option>
                        {/* Add more options as needed */}
                    </Form.Select>
                    <Form.Control id="number"  type="tel" className="vendorNumber addingVendor"  placeholder="Enter phone number" required   value={numberDetail.number }
                     onChange={handlNumberDetails}/>
                  </div>
              </Form.Group>

              <Form.Group className="vendorDivs" controlId="email">
                <Form.Label  className=" addingVendor" >Email Address <span className="red">*</span> </Form.Label>
                <Form.Control  className=" addingVendor vendorEmail"  type="email" placeholder="Enter email address" required value={formData.email}
                  onChange={handleChange}/>
              </Form.Group>
              
              <Form.Group className="vendorDivs" controlId="einNumber">
                <Form.Label  className=" addingVendor vendorcompanyName" > EIN Number<span className="red">*</span> </Form.Label>
                <Form.Control  className=" addingVendor vendorcompanyNameInput"  type="text" placeholder="Enter EIN" required value={formData.einNumber}
                  onChange={handleChange}/>
              </Form.Group>
            </Form>
             
            
              <button  onClick={handleNext} className="vendorChangeButton">
                Next
              </button>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <Form>
              <Form.Group className="" controlId="streetAddress1">
                <Form.Label   className="addingVendor vendorcompanyName" >Street Address 1 <span className="red">*</span> </Form.Label>
                <Form.Control className=" addingVendor vendorcompanyNameInput"type="text" placeholder="Enter street address 1" required value={formData.streetAddress1}
                  onChange={handleChange} />
              </Form.Group>

              <Form.Group className="vendorDivs" controlId="streetAddress2">
                <Form.Label  className=" addingVendor" >Street Address 2 <span className="red">*</span> </Form.Label>
                <Form.Control className=" addingVendor vendorcompanyNameInput" type="text" placeholder="Enter street address 2"  value={formData.streetAddress2}
                  onChange={handleChange}/>
              </Form.Group>
              
              <div className="vendorNameDiv">
                <Form.Group className="vendorDivs" controlId="city">
                  <Form.Label   className="addingVendor vendorName" >City <span className="red">*</span> </Form.Label>
                  <Form.Control className=" addingVendor vendorNameInput" type="text" placeholder="Enter city" required value={formData.city}
                    onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="vendorDivs" controlId="state">
                  <Form.Label  className=" addingVendor vendorName" >State <span className="red">*</span> </Form.Label>
                  <Form.Select id="state" className=" addingVendor vendorNameInput" value={formData.state}    onChange={handleChange}>
                        <option value="Uttar Pradesh">Uttar Pradesh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </option>
                        <option value="M.P">M.P </option>
                        <option value="Assamm">Assamm </option>
                    </Form.Select>
                </Form.Group>
              </div>

              <div  className="vendorNameDiv">
                  <Form.Group className="vendorDivs" controlId="zipCode">
                    <Form.Label  className=" addingVendor vendorName">ZIP Code <span className="red">*</span> </Form.Label>
                    <Form.Control  className=" addingVendor vendorNameInput" type="text" placeholder="Enter ZIP code" required value={formData.zipCode} 
                      onChange={handleChange}/>
                  </Form.Group>

                  <Form.Group className="vendorDivs" controlId="country">
                    <Form.Label  className=" addingVendor vendorName">Country <span className="red">*</span> </Form.Label>
                    <Form.Select  id="country" value={formData.country}  className=" addingVendor vendorNameInput" onChange={handleChange}>
                            <option value="India">India &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;</option>
                            <option value="U.S.A">U.S.A </option>
                            <option value="UK">UK </option>
                    </Form.Select>
                  </Form.Group>
               </div>
            </Form>

            <div className="vendorButtonDiv">
              <button   onClick={handleBack}> Back  </button>
              <button  onClick={handleNext}> Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step">            
          <Form>
              <Form.Group className="" controlId="accountHolderName">
                <Form.Label  className=" addingVendor vendorcompanyName" >Account Holder Name <span className="red">*</span> </Form.Label>
                <Form.Control className=" addingVendor vendorcompanyNameInput"  type="text" placeholder="Enter account holder name" required  value={formData.accountHolderName}
                  onChange={handleChange}/>
              </Form.Group>

              <div  className="vendorNameDiv">
                <Form.Group className="vendorDivs" controlId="bankName">
                  <Form.Label  className=" addingVendor vendorName" >Bank Name <span className="red">*</span> </Form.Label>
                  <Form.Control  className=" addingVendor vendorNameInput" type="text" placeholder="Enter bank name" required value={formData.bankName}
                    onChange={handleChange}/>
                </Form.Group>

                <Form.Group className="vendorDivs" controlId="accountType">
                  <Form.Label  className=" addingVendor vendorName" >Account Type <span className="red">*</span> </Form.Label>
                    <Form.Select  value={formData.accountType}  className=" addingVendor vendorNameInput" onChange={handleChange}>
                          <option value="+1">Saving Account  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;</option>
                          <option value="+91">+91 </option>
                          <option value="+44">+44 </option>
                          <option value="+61">+61</option>
                            {/* Add more options as needed */}
                    </Form.Select>
                </Form.Group>
              </div>

              <Form.Group className="vendorDivs" controlId="accountNumber">
                <Form.Label  className=" addingVendor vendorcompanyName" > Bank Address<span className="red">*</span> </Form.Label>
                <Form.Control className=" addingVendor vendorcompanyNameInput"  type="text" placeholder="Enter account number" required value={formData.accountNumber}
                  onChange={handleChange}/>
              </Form.Group>


              <Form.Group className="vendorDivs" controlId="accountNumber">
                <Form.Label  className=" addingVendor vendorcompanyName" >Account Number <span className="red">*</span> </Form.Label>
                <Form.Control className=" addingVendor vendorcompanyNameInput"  type="text" placeholder="Enter account number" required value={formData.accountNumber}
                  onChange={handleChange}/>
              </Form.Group>

              <Form.Group className="vendorDivs" controlId="confirmAccountNumber">
                <Form.Label  className=" addingVendor vendorcompanyName" > Confirm Account Number <span className="red">*</span> </Form.Label>
                <Form.Control className=" addingVendor vendorcompanyNameInput"  type="text" placeholder="Enter account number" required value={formData.confirmAccountNumber}
                  onChange={handleChange}/>
              </Form.Group>

              <Form.Group className="vendorDivs" controlId="swiftCode">
                <Form.Label  className=" addingVendor vendorcompanyName" >SWIFT/BIC Code <span className="red">*</span> </Form.Label>
                <Form.Control className=" addingVendor vendorcompanyNameInput"  type="text" placeholder="Enter SWIFT/BIC code" value={formData.swiftCode}
                  onChange={handleChange}/>
              </Form.Group>
            </Form>
             
            <div className="vendorButtonDiv">
              <button   onClick={handleBack}> Back  </button>
              <button  onClick={sendData} onHide={onHide}> Save</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal  show={show}
      onHide={onHide}
      centered
      dialogClassName="custom-modal"
      style={{
        "--progress-width": `${((step - 1) / 2) *100}%`, 
      }}
    >
      <Modal.Body className="VendorModel">
        <div className="step-navigation">
          <div className={`step-item ${step >= 1 ? "completed" : ""} ${step === 1 ? "active" : ""}`}>
            <div className="circle">1</div>
            <span className="">Basic</span>
          </div>
          <div className={`step-item ${step >= 2 ? "completed" : ""} ${step === 2 ? "active" : ""}`}>
            <div className="circle">2</div>
            <span className="">Address</span>
          </div>
          <div className={`step-item ${step >= 3 ? "completed" : ""} ${step === 3 ? "active" : ""}`}>
            <div className="circle">3</div>
            <span className="">Bank</span>
          </div>
        </div>
        
        {renderStepContent()}


      </Modal.Body>
       <ToastContainer />
    </Modal>
  );
}

export default AddVendorFormButton;
