import React, { useEffect, useState , useCallback} from "react";
import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import "./Csv.css";
import { apiEndPointUrl } from "../../../utils/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import axios from "axios";
import uploadLogo from '../../../assets/uploadLogo.jpeg';
import billsLogo from '../../../assets/bills.svg' 
import { useDropzone } from 'react-dropzone';

import Papa from "papaparse";
const MAX_FILE_SIZE = 500 * 1024 * 1024;


function Csv({ show, onHide }) {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(show);
  const [progress, setProgress] = useState(0);
 const [file, setFile] = useState(null);
 const [tableData, setTableData] = useState([]);
 const requiredHeaders = ["workEmail", "firstName", "department", "position", "password"];
  const [uploadStatus, setUploadStatus] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    role: "",
    department: "",
    password: "",
  });
  const [dummyState, setDummyState] = useState(0);

axios.defaults.withCredentials = true;
  
// Handle input changes

const handleUploadClick = () => {
  setShowModal(true);
}; 

const handleModalClose = () => {
  setShowModal(false);
  setFile(null);
  setProgress(0);
  setUploadStatus("");
  onHide();  
};

// Handling file selection via drag-and-drop or file input
const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
  if (rejectedFiles && rejectedFiles.length > 0) {
    // Handle rejected files (e.g., if file is too large)
    const { errors } = rejectedFiles[0];
    if (errors && errors[0].code === 'file-too-large') {
      toast.error("File size exceeds 10MB");
    }
  } else if (acceptedFiles && acceptedFiles.length > 0) {
    setFile(acceptedFiles[0]); // Get the first valid file
    handleFileUpload(acceptedFiles[0]); // Start upload immediately after file is selected
  }
}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  maxSize: MAX_FILE_SIZE, // 10MB file size limit
  multiple: false,
  accept: 'application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg',
});


const handleFileUpload = (fileToUpload) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    Papa.parse(content, {
      header: true,  // Parse the CSV with headers
      skipEmptyLines: true,
      complete: (result) => {
        setTableData(result.data);
        const headers = result.meta.fields;    
        const rows = result.data;
        console.log("Parsed Data:", rows);

    const missingFields = requiredHeaders.filter(field => !headers.includes(field));

    if (missingFields.length > 0) {
      toast.error("It must contain required fields: " + missingFields.join(", "));
      return;
    }
      if (missingFields.length > 0) {
        toast.error("It must contain required fields");
        return;
      }

      setTableData(rows);
      sendFileUpload(fileToUpload);
      toast.success("File uploaded successfully!");
    },
      error: () => {
        toast.error("Error parsing the file!");
      }
    });
     
  };
  reader.readAsText(fileToUpload);
};


const sendFileUpload = async (fileToUpload) => {
  const formData = new FormData();
  formData.append("file", fileToUpload);

  // console.log("file", formData)
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  

  try {
    const response = await axios.post(`${apiEndPointUrl}/signup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      },
    });

    if (response.status === 200) {
      setProgress(100);
      setTimeout(() => {
        setUploadStatus("success");
        toast.success("All users created successfully !", { autoClose: 1500 });
      },3500)
      onHide();  
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error("File size exceeds 500MB", { autoClose: 1500 });
      setUploadStatus("error");
    } else {
      toast.error("File upload failed", { autoClose: 1500 });
      setUploadStatus("error");
    }
  }
}

  useEffect(()=>{
    console.log("show", tableData)
     
},[tableData])

  return (
    // <div className="form-step">
   
      <Modal
          show={showModal}
          onHide={handleModalClose}
          size="s"
          backdrop={false} 
          style={{ marginTop: '6%', width: '70%', marginLeft: '19%' }}
          scrollable
          dialogClassName="modal-90w"   
        >
          <Modal.Header closeButton >
          <Modal.Title>Upload CSV files</Modal.Title>
  
          </Modal.Header>
          <Modal.Body>
          
            <div
              {...getRootProps()}
              style={{
                border: '1.5px dashed #7939EF',
                padding: '50px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f3f3f3' : 'white',
                width:"93%",
                marginLeft:"3%",
                 borderRadius:'12.23px'
              }}
            >
            <img src={uploadLogo} style={{ height:"100px", width:"100px" }}/>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <p>Drag and drop your CSV file here or Browse file <span style={{ color: 'blue', textDecoration: 'underline' }}>Browse file</span></p>
              )}
            </div>
            {file && (
              <div style={{display:"flex",marginTop: '20px', border: `2px solid ${uploadStatus === 'success' ? '#208348' : '#7939EF'}`, borderRadius:"12.23px",padding:"2%" ,width: '94%', marginLeft:"3%"}}>
                <img src={billsLogo} style={{height:"24.46px", width:"24.46px", margin:"3% 1.5% 1.5% 1%"}}/>
                <div>
                <p style={{ font:"Inter, sans-serif", color:"#141414", fontWeight:"500", fontSize:'14.67px'}} >{file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)</p>
                
                {/* <ProgressBar now={progress}
                  label={`${progress}%`}
                  variant={uploadStatus === 'error' ? 'danger' : progress === 100 ? 'success' : ''}
                  style={{ height: '11px', width:"500px", font:"Inter,, sans-serif", color:"#141414", fontWeight:"500"}} 
                   
                /> */}
                                </div>
              </div>
            )}
          </Modal.Body>
          <ToastContainer />
        </Modal>
  
  // </div>
  
);

}

export default Csv;