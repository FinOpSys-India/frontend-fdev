import React, { useState } from 'react';
import "./PreviewSection.css";
import invoiceImg from "../.../../../../assets/invoice.png";
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { apiEndPointUrl } from "../../../utils/apiService";
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


function PreviewSection({ invoice }) {

  // const [invoiceId, setInvoiceId] = useState('');
  const [acceptStatus, setacceptStatus] = useState();
  const [declinedStatus, setdeclinedStatus] = useState('');
  const [declinedform, setdeclinedform] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClickReason = (index) => {
    setSelected(index); // Set the clicked item as selected
  };

  
  const handleAccept = async () => {
    setacceptStatus("Accept the invoice")
    try {
      console.log(invoice.caseId)
      const response = await axios.post(`${apiEndPointUrl}/accept`, {
        invoiceId: invoice.caseId, // Replace with the actual invoice ID field
        status: acceptStatus
      });
      console.log('Invoice accepted:', response.data);
      toast.success(`${response.data.message}`);
    } catch (error) {
      console.error('Error accepting invoice:', error);
      // toast.error(`${error.message}`);
    }
  };


  function handleDeclineform(){
    setdeclinedform(true)
  };

 const DeclineButtonWithform = async ()=> {
    // setdeclinedStatus("Decline the invoice")
    if(selected!==null){
      try {
        console.log(invoice.caseId)
        let declinedStatus = "Decline the invoice"
        console.log(declinedStatus)
        const response = await axios.post(`${apiEndPointUrl}/decline`, {
          invoiceId: invoice.caseId, // Replace with the actual invoice ID field
          status: declinedStatus
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
      {/* <p>Case ID: {invoice.caseId}</p> */}
{console.log(invoice)}

      <div  className='PreviewSectionEach' style={{ display: 'flex', borderRadius:"24px" }}>
          <div style={{ flex: '1',}} className='PreviewSectionLeft'>
            <img src={invoiceImg} id='invoiceImg'/>
          </div>

          
          {
               declinedform === false
                      ?
                <div style={{ flex: '1',}} className='PreviewSectionRight'>
                <nav  className='PreviewSectionNavBar'>
                    <p>Jingle Marketing Agency</p>
                    <p className='p'>{invoice.inboxMethod}</p>
                </nav>

                <p className='PreviewSectionAdress'>4140 Parker Rd. Allentown, New Mexico 31134</p>
                <div  className='Previewdescription'>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel'  >Bill Number</span>
                    <span className='PreviewdescriptionInput'>{invoice.billId}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Bill Date </span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{invoice.receivingDate}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Receiving Date</span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{invoice.receivingDate}</span>
                  </div>
                  <div  className='PreviewLabelAndInput'>
                    <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Due Date</span>
                    <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">{invoice.dueDate}</span>
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
                      {/* {invoices.map((invoice) => ( */}
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
                  <span className='PreviewDataTotalInput'>nbnb</span>
                </div>

                <div className='PreviewDataAcceptAndDeline'>
                  <button className='PreviewDataAccept' onClick={handleAccept}>Accept</button>
                  <button className='PreviewDataDeline' onClick={handleDeclineform}>Deline</button>
                </div>

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