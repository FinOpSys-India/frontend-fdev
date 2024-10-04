import React from 'react';
import "./PreviewSection.css";
import invoiceImg from "../.../../../../assets/invoice.png";
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { apiEndPointUrl } from "../../../utils/apiService";


function PreviewSection({ invoice }) {


  const handleAccept = async () => {
    // try {
    //   const response = await axios.post(`${apiEndPointUrl}/accept`, {
    //     invoiceId: invoice.caseId, // Replace with the actual invoice ID field
    //   });
    //   console.log(invoice.caseId)
    //   console.log('Invoice accepted:', response.data);
    //   // Optionally, handle the response, like showing a success message
    // } catch (error) {
    //   console.error('Error accepting invoice:', error);
    //   // Optionally, handle the error, like showing an error message
    // }
  };


  const handleDecline = async () => {
    // try {
    //   const response = await axios.post('/api/invoice/decline', {
    //     invoiceId: invoice.caseId, // Replace with the actual invoice ID field
    //   });
    //   console.log('Invoice declined:', response.data);
    //   // Optionally, handle the response, like showing a success message
    // } catch (error) {
    //   console.error('Error declining invoice:', error);
    //   // Optionally, handle the error, like showing an error message
    // }
  };


  return (
    <div>
      { console.log(invoice)}
      <p>Case ID: {invoice.caseId}</p>


      <div  className='PreviewSectionEach' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ flex: '1',}} className='PreviewSectionLeft'>
            <img src={invoiceImg} id='invoiceImg'/>
          </div>

          <div style={{ flex: '1',}} className='PreviewSectionRight'>
            <nav  className='PreviewSectionNavBar'>
                <p>Jingle Marketing Agency</p>
                <p className='p'>email</p>
            </nav>

            <p className='PreviewSectionAdress'>4140 Parker Rd. Allentown, New Mexico 31134</p>
            <div  className='Previewdescription'>
              <div  className='PreviewLabelAndInput'>
                <span className='PreviewdescriptionLabel'  >Invoice Number</span>
                <span className='PreviewdescriptionInput'>854823DVT21</span>
              </div>
              <div  className='PreviewLabelAndInput'>
                <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Invoice Number</span>
                <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">854823DVT21</span>
              </div>
              <div  className='PreviewLabelAndInput'>
                <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Invoice Number</span>
                <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">854823DVT21</span>
              </div>
              <div  className='PreviewLabelAndInput'>
                <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Invoice Number</span>
                <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">854823DVT21</span>
              </div>
              <div  className='PreviewLabelAndInput'>
                <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Invoice Number</span>
                <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">854823DVT21</span>
              </div>
              <div  className='PreviewLabelAndInput'>
                <span className='PreviewdescriptionLabel' id="PreviewdescriptionLabel" >Invoice Number</span>
                <span className='PreviewdescriptionInput' id="PreviewdescriptionInput">854823DVT21</span>
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
              <button className='PreviewDataDeline' onClick={handleDecline}>Deline</button>
            </div>

          </div>
        
      </div>
    </div>
  )
}

export default PreviewSection