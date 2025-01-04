import React, { useEffect, useState } from 'react';
import "./PreviewSection.css";
import invoiceImg from "../.../../../../assets/invoice.png";
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { apiEndPointUrl } from "../../../utils/apiService";
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import "react-datepicker/dist/react-datepicker.css";

pdfjs.GlobalWorkerOptions.workerSrc ="/pdf.worker.min.js";

function PreviewSection({ invoiceId, setShowPreview,fetchInvoices, showAcceptDeclineButtons, vendorId  }) {
  const [declinedform, setdeclinedform] = useState(false);
  const [selected, setSelected] = useState(null);
  const [invoice, setInvoice]=useState({});
  const [vendor,setVendor]=useState({});
  const [pdfData,setPdfData]=useState(null)
  const handleClickReason = (index) => {
    setSelected(index); 
  };
  const role=sessionStorage.getItem('role');

  const fetchInvoice=async() =>{
    try {
      const response = await axios.get(`${apiEndPointUrl}/get-invoice/${invoiceId}`);
      const vendorResponse =  await axios.get(`${apiEndPointUrl}/get-vendor/${vendorId}`);
      setVendor(vendorResponse.data);
      setInvoice(response.data);
      setPdfData(response.data.billData);
      console.log(response.data.billData)
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  }
  useEffect(()=>{
    fetchInvoice();
  },[invoiceId]);
  const handleAccept = async () => {
    try {
      const response = await axios.post(`${apiEndPointUrl}/accept`, {
        invoiceId: invoiceId,
        role:role
      });
      toast.success(`${response.data.message}`);
      setShowPreview(false);
      fetchInvoices();
    } catch (error) {
      console.error('Error accepting invoice:', error);
      // toast.error(`${error.message}`);
    }
  };


  function handleDeclineform(){
    setdeclinedform(true)
  };

 const DeclineButtonWithform = async ()=> {
    if(selected!==null){
      try {
        const response = await axios.post(`${apiEndPointUrl}/decline`, {
          invoiceId: invoiceId, // Replace with the actual invoice ID field
          role: role
        });
        console.log('Invoice declinedStatus:', response.data.message);
        toast.success(`${response.data.message}`);
       } catch (error) {
        console.log('Error declinedStatus invoice:', error.message); 
        // toast.error(`${error.message}`);
      }
    }
    else{
      toast.error('Slelect the reason!');
    }
};

  return (
    <div style={{borderRadius:"24px"}}>

      <div  className='PreviewSectionEach' style={{ display: 'flex', borderRadius:"24px" }}>
          <div style={{ flex: '1',}} className='PreviewSectionLeft'>
            {pdfData ? (
                      <Worker workerUrl="/pdf.worker.min.js">
                      <Viewer fileUrl={`data:application/pdf;base64,${pdfData}`} />
                  </Worker>
                    ) : (
                        <p>Loading PDF...</p>
                    )}
          </div>

          
          {
               declinedform === false
                      ?
                <div style={{ flex: '1',}} className='PreviewSectionRight'>
                <nav  className='PreviewSectionNavBar'>
                    <p>{vendor.vendorName}</p>
                    <p className='p'>{invoice.inboxMethod}</p>
                </nav>

                <p className='PreviewSectionAdress'>{vendor.address}</p>
                <div  className='Previewdescription'>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel'  >Bill Number</span>
                    <span className='PreviewdescriptionInput'>{invoice.billId}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Bill Date </span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{new Date(invoice.date).toLocaleDateString()}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Receiving Date</span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{new Date(invoice.receivingDate).toLocaleDateString()}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Due Date</span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Department *</span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{invoice.department}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" > GL Code *</span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{invoice.glCode}</span>
                  </div>
                </div>

                <div className="mt-4 d-flex flex-column align-items-center ">
                  <Table   className="PreviewdescriptionTable">
                    <thead>
                      <tr  className="PreviewdescriptionThead">
                        <th>Bill Number</th>
                        <th>Bill Date</th>
                        <th>Inbox Method</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key=""  className='PreviewdescriptionData'>
                          <td>invoice.billId</td>
                          <td>invoice.Method</td>
                          <td>invoice.amount</td>
                          <td>invoice.col6</td>
                        </tr>
                        <tr key=""  className='PreviewdescriptionData'>
                          <td>invoice.billId</td>
                          <td>invoice.Method</td>
                          <td>invoice.amount</td>
                          <td>invoice.col6</td>
                        </tr>
                        <tr key=""  className='PreviewdescriptionData'>
                          <td>invoice.billId</td>
                          <td>invoice.Method</td>
                          <td>invoice.amount</td>
                          <td>invoice.col6</td>
                        </tr>
                      {/* ))} */}
                    </tbody>
                  </Table>
                </div>
                
                <div className='PreviewDataTotalDiv'>
                  <span className='PreviewDataTotal'>Total</span>
                  <span className='PreviewDataTotalInput'>{invoice.amount}</span>
                </div>

                {showAcceptDeclineButtons?<div className='PreviewDataAcceptAndDeline'>
                  <button className='PreviewDataAccept' onClick={handleAccept}>Accept</button>
                  <button className='PreviewDataDeline' onClick={handleDeclineform}>Deline</button>
                </div>:null}

              </div>
                 :
                <div style={{ flex: '1',}} className='PreviewSectionRight'>
                    <nav  className='PreviewSectionNavBar'>
                        <button className='formCloseButton'>Decline Feedback</button>
                    </nav>

                    <div className='reasonOfDeclineDiv'>
                        <p className={`reasonOfDecline ${selected === 0 ? 'selected' : ''}`} onClick={() => handleClickReason(0)}><EditIcon style={{fontSize:"16px"}}/> Incorrect data</p>
                        <p  className={`reasonOfDecline ${selected === 1  ? 'selected' : ''}`} onClick={() => handleClickReason(1)}><EditIcon style={{fontSize:"16px"}}/>Missing Invoice</p>
                        <p  className={`reasonOfDecline ${selected === 2 ? 'selected' : ''}`} onClick={() => handleClickReason(2)}><EditIcon style={{fontSize:"16px"}}/> Duplicate Invoice</p>
                        <p  className={`reasonOfDecline ${selected === 3 ? 'selected' : ''}`} onClick={() => handleClickReason(3)}><EditIcon style={{fontSize:"16px"}}/> Calculation Error</p>
                        <p  className={`reasonOfDecline ${selected === 4 ? 'selected' : ''}`} onClick={() => handleClickReason(4)}><EditIcon style={{fontSize:"16px"}}/> Other</p>
                        <button className='DeclineButton' onClick={DeclineButtonWithform}> Decline </button>
                    </div>
                </div>    


          }
        
      </div>
    </div>
  )
}

export default PreviewSection