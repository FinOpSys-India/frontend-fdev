import React from 'react'
import upload from '../../../assets/upload.svg'
import rightButton from '../../../assets/rightButton.svg'
import activityLog from '../../../assets/activityLog.svg';
import acitivityPointButton from '../../../assets/acitivityPointButton.svg'
import leftButton from '../../../assets/leftButton.svg'
import crossButton from '../../../assets/crossButton.svg'
import dropButton from '../../../assets/dropButton.svg'
import upButton from '../../../assets/upButton.svg'
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiEndPointUrl } from '../../../utils/apiService';
import axios from "axios"
import { Table } from 'react-bootstrap';
import "./ActvityLog.css"

function ActvityLog({ ActvityLogInvoice, ActvityLogCaseId, acitivityLogClose}) {

    const [openDetail, setOpenDetail] = useState(false);
    const [showacitivityLog, setShowAcitivityLog] = useState(false);
    const [showSideSection, setShowSideSection] = useState(false);
    const [showChatSection, setShowChatSection] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [ActvityLog, setActvityLog] = useState([])
    const [caseId, setCaseId] = useState('');

 // --------------------acitivityLogSection--------------------------------
 const openModal = () => setIsModalOpen(true);

 
    function openDetailButton(index){
    //   setOpenDetail(true);
    setOpenDetail(prevState => prevState === index ? null : index);
    }

    function closeDetailButton(index) {
        setOpenDetail(prevState => prevState === index ? null : index);
        acitivityLogClose();  // This will call the close function passed as a prop.
    }
    

    function acitivityLogClose(){
        setShowSideSection(false);
        setShowAcitivityLog(false);
    }
    
   
    const fetchActvityLog = async () => {
        try {
          const response = await axios.get(`${apiEndPointUrl}/get-actvity-log/${ActvityLogCaseId}` );
          setCaseId(response.data.CASE_ID); // Set CASE_ID
          setActvityLog(response.data.ACTIVITIES); 
          console.log(response.data.CASE_ID)
          console.log(response.data.ACTIVITIES)
        } catch (error) {
          toast.error("Failed to fetch ActvityLog", { autoClose: 1500 });
        }
      };
  
  

    
  useEffect(() => {
    fetchActvityLog();
    console.log("ActvityLogInvoice:", ActvityLogInvoice);
    console.log("ActvityLogCaseId:", ActvityLogCaseId);
  }, [ActvityLogInvoice, ActvityLogCaseId]);



  return (
    <div className='acitityLog'>
    <div className='acitivityNavbar'>
        <span id="activitylog">Activity Log {ActvityLogCaseId} </span>
        <div className='activitylogBAutton'>
          <img src={leftButton}/>&nbsp;
          <img src={rightButton}/>&nbsp;| &nbsp;
          <img src={crossButton}onClick={() => {
              console.log("Closing Activity Log...");
              acitivityLogClose();
            }}/>
        </div>
    </div>

    <div className='activitylogContent'>
       <div  className='activitylogRight'>
                <div  className='activitylogBar'>
                    <p id='activitylogVendorName'>{ActvityLogInvoice.vendorName}</p>
                    <p className='activitylogAdress'>4140 Parker Rd. Allentown, New Mexico </p>
                </div>

                <div  className='activitylogdescription'>
                  <div  className='activitylogLabelAndInput'>
                    <span className='activitylogdescriptionLabel'  >Bill Number</span>
                    <span className='activitylogdescriptionInput'>{ActvityLogInvoice.billId}</span>
                  </div>
                  <div  className='activitylogLabelAndInput'>
                    <span className='activitylogdescriptionLabel' id="activitylogdescriptionLabel" >Bill Date</span>
                    <span className='activitylogdescriptionInput' id="activitylogdescriptionInput">{ActvityLogInvoice.receivingDate}</span>
                  </div>
                  <div  className='activitylogLabelAndInput'>
                    <span className='activitylogdescriptionLabel' id="activitylogdescriptionLabel" >Receiving Date</span>
                    <span className='activitylogdescriptionInput' id="activitylogdescriptionInput">{ActvityLogInvoice.receivingDate}</span>
                  </div>
                  <div  className='activitylogLabelAndInput'>
                    <span className='activitylogdescriptionLabel' id="activitylogdescriptionLabel" >Due Date</span>
                    <span className='activitylogdescriptionInput' id="activitylogdescriptionInput">{ActvityLogInvoice.dueDate}</span>
                  </div>
                  <div  className='activitylogLabelAndInput'>
                    <span className='activitylogdescriptionLabel' id="activitylogdescriptionLabel" >Department *</span>
                    <span className='activitylogdescriptionInput' id="activitylogdescriptionInput">{ActvityLogInvoice.department}</span>
                  </div>
                  <div  className='activitylogLabelAndInput'>
                    <span className='activitylogdescriptionLabel' id="activitylogdescriptionLabel" > GL Code *</span>
                    <span className='activitylogdescriptionInput' id="activitylogdescriptionInput">{ActvityLogInvoice.glCode}</span>
                  </div>
                </div>

                <div className="mt-2">
                  <Table   className="activitylogdescriptionTable">
                    <thead>
                      <tr  className="activitylogdescriptionThead">
                        <th> Details</th>
                        <th>Rate</th>
                        <th>Qyt</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key=""  className='activitylogdescriptionData'>
                          <td>Louis Vuitton</td>
                          <td>$256</td>
                          <td>21</td>
                          <td>$ 6584.00</td>
                        </tr>
                        <tr key=""  className='activitylogdescriptionData'>
                          <td>Louis Vuitton</td>
                          <td>$256</td>
                          <td>21</td>
                          <td>$ 6584.00</td>
                        </tr>
                        <tr key=""  className='activitylogdescriptionData'>
                          <td>Louis Vuitton</td>
                          <td>$256</td>
                          <td>21</td>
                          <td>$ 6584.00</td>
                        </tr>
                        <tr key=""  className='activitylogdescriptionData'>
                          <td>Total</td>
                          <td></td>
                          <td></td>
                          <td>$ 6584.00</td>
                        </tr>
                    </tbody>
                  </Table>
                </div>
                
                {/* <div className='activitylogDataTotalDiv'>
                  <span className='activitylogDataTotal'>Total</span>
                  <span className='activitylogDataTotalInput'>invoice.amount</span>
                </div> */}

              </div>
  
    {  
       ActvityLog.length > 0 && caseId===ActvityLogCaseId
              ? 
            ActvityLog.map((activity, index) => (
            <div className='activitylogSectionDiv' key={index} >
                <div className='activitylogPoint'><img src={acitivityPointButton}/> </div>
                <div className='activitylogInformation'> 
                    <div  className='activityNameAndDrop'>
                    <span>{activity.accpetedBy} accepted the invoice</span>
                    {
                        openDetail=== false ?   <img src={dropButton}  onClick={() => openDetailButton(index)} />
                                :
                        <img src={upButton} onClick={() => closeDetailButton(index)} />    
                    }
                    </div>

                    <div className='acitivityDetails'> 
                    {
                        openDetail=== index 
                            ?
                        <div className='acitivityDetailedInfoDiv' style={{marginTop:"3%", paddingBottom:"3%"}}>
                            <div className='acitivityDetailedInfo'>
                                <span className='acitivityDetailLabel'>Submitted via</span>
                                <span className='acitivityDetailInput'>{activity.accpetedBy}</span>
                            </div>

                            <div className='acitivityDetailedInfo'>
                                <span className='acitivityDetailLabel'>Invoice number</span>
                                <span className='acitivityDetailInput'>{ActvityLogInvoice.billId}</span>
                            </div>

                            <div className='acitivityDetailedInfo'>
                                <span className='acitivityDetailLabel'>Vendor</span>
                                <span className='acitivityDetailInput'>{ActvityLogInvoice.vendorName}</span>
                            </div>

                            <div className='acitivityDetailedInfo'>
                                <span className='acitivityDetailLabel'>Due date</span>
                                <span className='acitivityDetailInput'>{ActvityLogInvoice.dueDate}</span>
                            </div>

                            <div className='acitivityDetailedInfo'>
                                <span className='acitivityDetailLabel'>Amount</span>
                                <span className='acitivityDetailInput' >$2548.00</span>
                            </div>
                        </div>
                            :
                        <span>Other details</span>
                        
                        }
                        
                    <div className='acitivityDateAndTime'>
                        <span id='acitivityDateAndTime'><span id="acitivityDateAndTime"> {new Date(activity.timestamp).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        }).replace(',', ' |')}
                     </span>
                    </span>
                        <span className='acitivityinvoiceState' >{activity.status}</span>
                    </div>
                    </div>
                </div>
            </div>
            ))
                               : 
            "" 
        }
        {/* <div className='activitylogSectionDiv' style={{marginTop:"-3%"}}>
            <div className='activitylogPoint'><img src={acitivityPointButton}/> </div>
            <div className='activitylogInformation'> 
                <div  className='activityNameAndDrop'>
                   <span>James submitted a invoice</span>
                    <img src={dropButton} />
                </div>

                <div className='acitivityDetails'> 
                   <span>Other details</span>
                   <div className='acitivityDateAndTime'>
                      <span id='acitivityDateAndTime'>12 May 24 | 08:00 AM</span>
                      <span className='acitivityinvoiceState' >Invoice Submission</span>
                   </div>
                </div>
            </div>
        </div>

        <div className='activitylogSectionDiv'    style={{marginTop:"-3%"}}>
            <div className='activitylogPoint'><img src={acitivityPointButton}/> </div>
            <div className='activitylogInformation'> 
                <div  className='activityNameAndDrop'>
                   <span>James submitted a invoice</span>
                    <img src={dropButton}/>
                </div>

                <div className='acitivityDetails'> 
                   <span>Other details</span>
                   <div className='acitivityDateAndTime'>
                      <span id='acitivityDateAndTime'>12 May 24 | 08:00 AM</span>
                      <span className='acitivityinvoiceState' >Invoice Submission</span>
                   </div>
                </div>
            </div>
        </div> */}

        <div className='activityLogExport' onClick={openModal}>
           Export  
        </div> 

        
    </div>
</div>
  )
}

export default ActvityLog
  
               