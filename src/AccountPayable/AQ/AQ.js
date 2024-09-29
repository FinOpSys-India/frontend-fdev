import React,{ useState, useCallback }  from 'react'
import { Modal, ProgressBar } from "react-bootstrap";import  "./AQ.css";
import update from '../../assets/update.svg';
import upload from '../../assets/upload.svg';
import filter from '../../assets/filter.svg';
import crop from '../../assets/crop.svg';
import { apiEndPointUrl } from "../../utils/apiService";
import { Table } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useDropzone } from 'react-dropzone';
import uploadLogo from '../../assets/uploadLogo.jpeg';
import billsLogo from '../../assets/bills.svg' 
import axios from "axios";
import Home from '../../Home/Home';
import { DisplaySettings } from '@mui/icons-material';

const MAX_FILE_SIZE = 500 * 1024 * 1024;


function AQ() {

  const [activeButton, setActiveButton] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(1); // State for active pagination item
  const [itemsPerPage] = useState(5);   
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const handleUploadClick = () => {
    setShowModal(true);
}; 
  const handleModalClose = () => {
    setShowModal(false);
    setFile(null);
    setProgress(0);
    setUploadStatus("");
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

  const handleFileUpload = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await axios.post(`${apiEndPointUrl}/upload`, formData, {
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
          toast.success("File uploaded successfully!", { autoClose: 1500 });
        },3500)
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
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };


  const data = [
    { id: 1, col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4', col5: 'Data 5', col6: 'Data 6' },
    { id: 2, col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4', col5: 'Data 5', col6: 'Data 6' },
  ];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage1 = 10; // Number of items per page
  const totalItems = 99; // Example total number of items (coins)

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    setCurrentPage(value);
    // Fetch or update your data for the new page here
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage1);

  return (
    <div style={{display:"flex"}}>
    <Home currentPage="invoiceQueue" />
    <div className='AQTab'>
      <div className='AQNavbar'>
            <h4 className='AQHeading'>  Approval Queue </h4>

            <div className='AQNavbarSideButtons'> 
              <button className='AQNavbarUpdateButton'>  <img src={update} /> Update</button>
              <button className='AQNavbarUploadButton' onClick={handleUploadClick}><img src={upload}/>Upload Bill</button>
            </div>
      </div>


     <div className='AQBelowHeading'>
        <div className='AQAcceptAndDecline'>
          <button className={`AQAllDiv ${activeButton === 'all' ? 'active' : ''}`}
            onClick={() => handleButtonClick('all')}>
            <div className='insideAQAllDiv'>
                 <img src={crop} style={{ width: "0.9em", height: "2em" , color:"black"}} /> <span>All</span>
            </div>

             <p>21</p>
          </button>

          <button className={`AQDeclineDiv ${activeButton === 'declined' ? 'active' : ''}`}
            onClick={() => handleButtonClick('declined')}>
            <div className='insideAQDeclineDiv '>
                 <img src={crop} style={{ width:"0.9em", height: "2em" }} /> <span>Declined</span>
            </div>

             <p>21</p>
          </button>
        </div>

         <button className='AQfilter'>
             <img src={filter} style={{ width:"0.9em", height: "2em" }} /> <span>Filter</span>
         </button>

     </div>


          <div className="mt-4 d-flex flex-column align-items-center outerTableDiv">
            <Table   className="custom-width">
              <thead>
                <tr>
                  {/* <th><input type="checkbox" /></th> */}
                  <th><input type="checkbox" />&nbsp;&nbsp;&nbsp;Vendor Name</th>
                  <th>Bill Number</th>
                  <th>Bill Date</th>
                  <th>Inbox Method</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>  <input type="checkbox" />  <img  src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                     &nbsp;&nbsp;&nbsp;{item.col1}</td>
                    <td>{item.col2}</td>
                    <td>{item.col3}</td>
                    <td>{item.col4}</td>
                    <td>{item.col5}</td>
                    <td>{item.col6}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
        </div>

      <div className="pagination-div">
        <div className='pagination-insideDiv'>
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={handlePageChange}
          />
          </div>
      </div>
      <Modal
          show={showModal}
          onHide={handleModalClose}
          size="lg"
          style={{ marginTop: '2%', width: '70%', marginLeft: '19%' }}
          scrollable
          dialogClassName="modal-90w"
  
          
        >
          <Modal.Header closeButton >
          <Modal.Title>Upload Invoice</Modal.Title>
  
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
                <p>Drag and drop your file here or <span style={{ color: 'blue', textDecoration: 'underline' }}>Browse file</span></p>
              )}
            </div>
            <div style={{marginTop:"2%",display:"flex", flexDirection:"row", justifyContent:"space-between",width: '94%', marginLeft:"3%"}}>            
              <p>Supported formats: PDF, DOC, XLSX & JPEG.</p>
              <p>Max file size: 500MB</p>
            </div>
            {file && (
              <div style={{display:"flex",marginTop: '20px', border: `2px solid ${uploadStatus === 'success' ? '#208348' : '#7939EF'}`, borderRadius:"12.23px",padding:"2%" ,width: '94%', marginLeft:"3%"}}>
                <img src={billsLogo} style={{height:"24.46px", width:"24.46px", margin:"3% 1.5% 1.5% 1%"}}/>
                <div>
                <p style={{ font:"Inter, sans-serif", color:"#141414", fontWeight:"500", fontSize:'14.67px'}} >{file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)</p>
                
                <ProgressBar
                  now={progress}
                  label={`${progress}%`}
                  variant={uploadStatus === 'error' ? 'danger' : progress === 100 ? 'success' : ''}
                  style={{ height: '11px', width:"500px", font:"Inter,, sans-serif", color:"#141414", fontWeight:"500"}} 
                   
                />
                                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
        <ToastContainer />
        </div>
    </div>
  )
}

export default AQ