import React,{useCallback, useEffect, useState} from 'react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDropzone } from 'react-dropzone';
import uploadLogo from '../../assets/uploadLogo.jpeg';
import axios from 'axios';
import { apiEndPointUrl } from '../../utils/apiService';
import Select from 'react-select'; // Import React-Select
import "./CreateManualForm.css"
import { blue } from '@mui/material/colors';

const MAX_FILE_SIZE = 500 * 1024 * 1024;


function CreateManualForm({showCreateBillModal, setShowCreateBillModal, fetchInvoices}) {
    const [vendorList, setVendorList] = useState([]);
    const [createBillDetails, setCreateBillDetails]=useState({
       vendorId:"",
       amount:"",
        invoiceNo:"",
        recievingDate:null,
        dueDate:null,
        dept:"",
        glCode:"",
        fileData:null
      })
    const departments=["IT Department", "HR", "Sales", "Marketing", "Finance"];
      const fetchVendors = async () => {
        try {
          const response = await axios.get(`${apiEndPointUrl}/getAllVendors`);
          setVendorList(response.data); // Adjust based on API response structure
        } catch (error) {
          console.error('Error fetching vendors:', error);
        }
      };
      useEffect(() => {
        fetchVendors();
      }, []);
      const [file,setFile] = useState(null)
      const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
          // Handle rejected files (e.g., if file is too large)
          const { errors } = rejectedFiles[0];
          if (errors && errors[0].code === 'file-too-large') {
            // toast.error("File size exceeds 10MB");
          }
        } else if (acceptedFiles && acceptedFiles.length > 0) {
          setFile(acceptedFiles[0]); // Get the first valid file
           // Start upload immediately after file is selected
          }
      }, []);
      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: MAX_FILE_SIZE, // 10MB file size limit
        multiple: false,
        accept: 'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg',
      });
    
      const onFinishCreateInvoice = async (event)=>{
        event.preventDefault();
        console.log(createBillDetails)
        const formData = new FormData();
        formData.append('file', file); // File
        formData.append('createBillDetails', JSON.stringify(createBillDetails));
        
        try{
            const response =await axios.post(`${apiEndPointUrl}/createInvoice`,formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          console.log(response)
          if (response.data.message==="Invoice created successfully" ) {
            alert("Invoice Created!");
            fetchInvoices();
            setShowCreateBillModal(false);
          }
        } catch (error) {
          console.error('Error creating invoice:', error);
        }
          setCreateBillDetails({
            vendorId:"",
            amount:"",
            invoiceNo:"",
            recievingDate:null,
            dueDate:null,
            dept:"",
            glCode:"",
            fileData:null
          })
          setFile(null)
      }
      const handleReceivingDate = (date)=>{
        setCreateBillDetails({ ...createBillDetails, recievingDate: date })
      }
      const handleDueDate=(date)=>{
        setCreateBillDetails({ ...createBillDetails, dueDate: date })
      }
  return (
    <Modal
          show={showCreateBillModal}
          onHide={()=>{setShowCreateBillModal(false)}}
          size="lg"
          style={{ marginTop: '2%', width: '70%', marginLeft: '19%' }}
          scrollable
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton >
  
          </Modal.Header>
          <Modal.Body>
          <div className="row">
            <form className="row manualInvoice" onSubmit={onFinishCreateInvoice}>

              <div className="col-12 vendorName-div">
              <label htmlFor="vendorName" className="form-label ">
              Vendor Name <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
            id="vendorName"
            className="select-vendor"
            options={vendorList.map((vendor) => ({
              value: vendor.vendorId,
              label: vendor.vendorName,
            }))}
            value={
              createBillDetails.vendorId
                ? {
                    value: createBillDetails.vendorId,
                    label: vendorList.find((vendor) => vendor.vendorId === createBillDetails.vendorId)?.vendorName || '',
                  }
                : null
            }
            onChange={(selectedOption) =>
              setCreateBillDetails({
                ...createBillDetails,
                vendorId: selectedOption.value,
              })
            }
            placeholder="Select a Vendor"
            isSearchable
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: 'rgba(240, 240, 240, 1)', // Set the desired background color for the dropdown
              }),
            }}
          />
              </div>

              
              <div className="col-6 invoiceNo-div">
                <label htmlFor="invoiceNo" className="form-label">Invoice Number <span style={{color:"red"}}>*</span></label>
                <input type="text" className="form-control formDiv" id="invoiceNo"  required placeholder="Invoice Number" value={createBillDetails.invoiceNo} onChange={(e) => setCreateBillDetails({ ...createBillDetails, invoiceNo: e.target.value })}/>
              </div>
              <div className="col-6 vendorName-div">
                <label htmlFor="amount" className="form-label">Amount <span style={{color:"red"}}>*</span></label>
                <input type="text" className="form-control formDiv" id="amount"  required placeholder="Amount" value={createBillDetails.amount} onChange={(e) => setCreateBillDetails({ ...createBillDetails, amount: e.target.value })}/>
              </div>
              <div className="col-6 recievingDate-div">
              <label>Receiving Date <span style={{color:"red"}}>*</span></label>
                  <DatePicker
                    selected={createBillDetails.recievingDate}
                    onChange={(date)=>handleReceivingDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker-input datePicker"
                  />
              </div>
              <div className="col-6 dueDate-div">
              <label>Due Date <span style={{color:"red"}}>*</span></label>
                  <DatePicker
                    selected={createBillDetails.dueDate}
                    onChange={(date)=>handleDueDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker-input datePicker"
                  />
              </div>
              <div className="col-6 dept-div">
                <label htmlFor="dept" className="form-label">Department<span style={{color:"red"}}>*</span></label>
                <Select
            id="dept"
            className="select-dept"
            options={departments.map((dept) => ({
              value: dept,
              label: dept,
            }))}
            value={{
              value: createBillDetails.dept,
              label: createBillDetails.dept,
            }}
            onChange={(selectedOption) =>
              setCreateBillDetails({
                ...createBillDetails,
                dept: selectedOption.value,
              })
            }
            placeholder="Select a Department"
            isSearchable
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: 'rgba(240, 240, 240, 1)', // Set the desired background color for the dropdown
              }),
            }}
          />
              </div>
              <div className="col-6 glCode-div">
                <label htmlFor="glCode" className="form-label">GL code <span style={{color:"red"}}>*</span></label>
                <input type="text" className="form-control formDiv" id="glCode"  required placeholder="GL code" value={createBillDetails.glCode} onChange={(e) => setCreateBillDetails({ ...createBillDetails, glCode: e.target.value })}/>
              </div>
              <div className="col-12 mt-3">
              <div
              {...getRootProps()}
              style={{
                border: '1.5px dashed #7939EF',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f3f3f3' : 'white',
                width:"96%",
                marginLeft:"3%",
                 borderRadius:'12.23px'
              }}
            >
              <img src={uploadLogo} style={{ height:"100px", width:"100px" }}/>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <p>Drag and drop your file here or <span style={{ color: 'blue', textDecoration: 'underline' }}>Browse file</span></p>
              )}
              {file && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <p>Selected File: <strong>{file.name}</strong></p>
                    </div>
                )}
            </div>
            <div style={{marginTop:"2%",display:"flex", flexDirection:"row", justifyContent:"space-between",width: '94%', marginLeft:"3%"}}>            
              <p>Supported formats: PDF, DOC, XLSX & JPEG.</p>
              <p>Max file size: 500MB</p>
            </div>
            </div>
              <div className="col-12">
                <button type="submit" className=" signupBtn">Create Invoice</button>
              </div>
              </form>
              </div>
            
          </Modal.Body>
        </Modal>
  )
}

export default CreateManualForm
