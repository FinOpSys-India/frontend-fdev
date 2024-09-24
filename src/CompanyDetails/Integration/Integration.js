import React, { useContext, useEffect, useState } from "react";
import "./Integration.css";
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios"
import { Modal, Button, Nav, Tab } from 'react-bootstrap';
import quickBookBackground from "../../images/quickbookBackground.png"
import quickbookLogo from "../../images/quickbookLogo.png"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { apiEndPointUrl } from "../../utils/apiService";


function Integration() {

    // const [isConnected, setIsConnected] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [authUrl, setAuthUrl] = useState('');
    const [person, setPerson] = useState(null);
    const [quickbookActiveness, setQuickbookActiveness] = useState();

 
    axios.defaults.withCredentials = true;
         
    const fetching = async () => {
        try {
            const res = await axios.get(`${apiEndPointUrl}/get-person-details`)
            if(res && res.data.length > 0) {
                const firstName = res.data[0].FIRSTNAME;
                console.log(firstName)
                const response = await axios.get(`${apiEndPointUrl}/get-updated-quickbook`,{params: { firstName: firstName }});
                console.log(response.data.quickbookActiveness)
                setQuickbookActiveness(response.data.quickbookActiveness)
            }  

            setPerson(res.data[0].FIRSTNAME);
            // quickBookfetching();
            // console.log("Fetching:", res.data);
        } 
        catch (error) {
            console.error("Error fetching:", error);
        }
    };


    useEffect(() => {
        fetching();
    },[]);
    
 

    // -------------------------------pop up------------------------------------

    function openPopUp(){
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }
      
     const sendDataToBackend =async (newQuickbookActiveness) => {
       
            const payload = {
                firstName: person,
                quickbookActiveness: newQuickbookActiveness
            };
            
            console.log("3"+newQuickbookActiveness)
            console.log("Sending payload:", payload);
            axios.post(`${apiEndPointUrl}/update-quickbook`, payload)
                .then(response => {
                    console.log('Success:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error.response ? error.response.data : error.message);
                });
        // }
    };
    


    
    
    const handleConnectClick = async () => {
        
       if(quickbookActiveness!==true){
          await  axios.get(`${apiEndPointUrl}/auth`)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    const newQuickbookActiveness = !quickbookActiveness;
                    setQuickbookActiveness(newQuickbookActiveness);
                    setAuthUrl(res.data.url); 
                    window.open(res.data.url, '_blank');
                    
                    sendDataToBackend(newQuickbookActiveness);
                    console.log('Authorization URL:', res.data.url);
                } else {
                    console.error('Error during OAuth flow:', res.statusText);
                }
            })
            .catch(error => console.error('Error during OAuth flow:', error));
       }

       if(quickbookActiveness===true){
            const newQuickbookActiveness = !quickbookActiveness;
            setQuickbookActiveness(newQuickbookActiveness);
           sendDataToBackend(newQuickbookActiveness);
       }
    };

    

// --------- get  data of activeness of quickbook integration--------

    const buttonStyles = quickbookActiveness ? {
        background: 'rgba(22, 163, 74, 0.1)',
        borderColor: 'rgba(22, 101, 52, 1)',
        color: 'rgba(22, 101, 52, 1)',
    } : {};

    const iconStyles = quickbookActiveness ? {
        color: 'rgba(22, 101, 52, 1)',
        fontSize: "15px"
    } : { fontSize: "15px" };




  return (
    <div >

        <div style={{ opacity: showPopup ? -9 : 1 }}>
            <div className='integrationNavbar'>
                <h6>Integration</h6>
                <SearchIcon style={{fontSize:"16.9px", position:"absolute", marginLeft:"641px", marginTop:"6px"}}/> <input className="but-search"  id="search" placeholder="Search" />
            </div>

            <div className="integrationDiv">

                <div className="container container1" >
                    <div className="row row1" >
                        <div className="col-md-4 personalDiv bg-light" >
                            <div className="integrationDiv1">
                                <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                                <button onClick={handleConnectClick} style={buttonStyles}>
                                    {quickbookActiveness ? <CheckIcon style={iconStyles} /> : <LinkIcon style={iconStyles} />}
                                    {quickbookActiveness ? " Connected" : " Connect"}
                            </button>
                            </div>

                            <div className="integrationDiv2">
                            <h6>Quick Book</h6>
                            <p>We need to write two line short description about a tool.</p>
                            </div> <hr/>


                            <div className="integrationDiv3">
                                <p onClick={openPopUp}>More Details</p>
                            </div>
                        </div>

                        <div className="col-md-4 bg-light personalDiv">
                            <div className="">Column 2</div>
                        </div>
                        
                        <div className="col-md-4 bg-light personalDiv">
                            <div className="p-3 border">Column 3</div>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------- */}

                <div className="container container2">
                    <div className="row row1" >
                            <div className="col-md-4 personalDiv bg-light">
                                <div className="integrationDiv1">
                                    <img src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                                    <button> <LinkIcon style={{ fontSize:"15px"  }}/> Connect</button>
                                </div>

                                <div className="integrationDiv2">
                                <h6>Quick Book</h6>
                                <p>We need to write two line short description about a tool.</p>
                                </div> <hr/>


                                <div className="integrationDiv3">
                                    <p>More Details</p>
                                </div>
                            </div>

                            <div className="col-md-4 bg-light personalDiv">
                            <div className="">Column 2</div>
                        </div>
                        
                        <div className="col-md-4 bg-light personalDiv">
                            <div className="p-3 border">Column 3</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>    




        <Modal show={showModal} onHide={handleClose} size="s"  style={{ marginTop:"6%", width:"27%", marginLeft:"45%"}}
            scrollable>
          <Modal.Body>
           <div className="integrationPopUp">
                <div className="integrationPopUpImageDiv">
                    <img  src={quickBookBackground} className="integrationBackground"/>
                    <img src={quickbookLogo} className="integrationLogo"/>
                </div>

                <div  className="integrationPopUpDetail">
                    <h5>Quickbook</h5>
                    <p>QuickBooks is one of the most popular accounting software for small businesses in 2024. Whether you want to move away from manual bookkeeping or 
                        your spreadsheets have grown into a multi headed hydra or you need a better option compared to your current software, QuickBooks can be a good choice without burning 
                        a hole in the pocket.
                    </p>
                </div>

                <div  className="integrationPopUpDetail">
                    <h5>Features</h5>
                    <p>QuickBooks is one of the most popular accounting software for small businesses in 2024. Whether you want to move away from manual bookkeeping or 
                        your spreadsheets have grown into a multi headed hydra or you need a better option compared to your current software, QuickBooks can be a good choice without burning 
                        a hole in the pocket.
                    </p>
                </div>
           </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" className="footerIntegration">
              < AddCircleOutlineIcon style={{fontSize:"12px"}} />   Connect 
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default Integration