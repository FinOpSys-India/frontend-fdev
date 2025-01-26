import React, { useState } from 'react'
import axios from "axios";
import  "./InsightPreviousChat.css";
import rightDoubleArrow from '../../../assets/rightDoubleArrow.svg';
import editChat from '../../../assets/editChat.svg'; 
import leftDoubleArrow from '../../../assets/leftDoubleArrow.svg'; 
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import share from '../../../assets/share.svg'; 
import edit from '../../../assets/edit.svg'; 
import deletChat from '../../../assets/delete.svg'; 
import { Modal, Button, Nav, Tab } from "react-bootstrap";


function InsightPreviousChat() {

    const [selectedItem, setSelectedItem] = useState('All Vendors');
    const [isPreviousChatSection, setIsPreviousChatSection] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [questionText, setQuestionText] = useState([
        "Total number of invoices received on Monday",
        "What is the total sales for the last quarter?",
        "How many new customers joined this month?"
    ]);
    const [showPopup, setShowPopup] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);  // Track the index
    const [showModal, setShowModal] = useState(false);
    
    const [popupQuestionIndex, setPopupQuestionIndex] = useState(null);  // Track the question for the popup


    const toggleOptions = (index) => {
        // Toggle options visibility for the clicked question
        setShowOptions(showOptions === index ? null : index);
    };
    const handlePreviousChatSection=()=>{
        setIsPreviousChatSection(!isPreviousChatSection)
    }


    // -----------------------handleRenameClick--------------
    const handleRenameClick = (index) => {
        setIsEditing(true); // Start editing
        setCurrentIndex(index); // Set the current question index for renaming
        setShowOptions(null);  // Hide options after renaming
    };

    
      const handleInputChange = (e) => {
        // setQuestionText(e.target.value);
        const updatedQuestions = [...questionText];
        updatedQuestions[currentIndex] = e.target.value;
        setQuestionText(updatedQuestions);
      };
    
      const handleBlur = () => {
        setIsEditing(false);
      };
    
      

      
    // -----------------------handleShareClick ,handleDeleteClick --------------
    const handleShareClick = (index) => {
        setPopupQuestionIndex(index); // Set the correct question index for sharing
        setShowPopup("share");
       setShowModal(true); 
       setShowOptions(null); 
    };

    const handleDeleteClick = (index) => {
    setPopupQuestionIndex(index); // Set the correct question index for deleting
    setShowPopup("delete");
    setShowModal(true); 
    setShowOptions(null); 
};

const handleConfirmDelete = () => {
    if (popupQuestionIndex !== null) {
        const updatedQuestions = questionText.filter((_, i) => i !== popupQuestionIndex);
        setQuestionText(updatedQuestions); // Update the question list after deletion
    }
    setShowPopup(null);
    setPopupQuestionIndex(null);
    setShowModal(false);
};


    const handleClosePopup = () => {
        setShowPopup(null);
        setPopupQuestionIndex(null);
    };


    const handleClose = () => setShowModal(false);

    return (
        isPreviousChatSection !== true 
                    ? 
        <div className="insightPreviousChatSection">
            <button id="leftDoubleArrow" onClick={handlePreviousChatSection}>
                <img src={leftDoubleArrow} alt="Expand previous chats" />
            </button>
        </div>
                       : 
        <div className="onclickPreviousChat">
            <div className="onclickPreviousChatSection">
                <button id="onclickleftDoubleArrow" onClick={handlePreviousChatSection}>
                    <img src={editChat} alt="Edit chat icon" />&nbsp;&nbsp;&nbsp;
                    Previous Conversation&nbsp;&nbsp;
                    <img  src={rightDoubleArrow}  style={{ height: '24px', width: '16px' }}/>
                </button>
            </div>
 
            {
                questionText.map((question, index) => (
                    <div className="PreviousChatQuestion" key={index}>
                        {
                            isEditing && currentIndex === index 
                                        ? 
                            <input  type="text"  value={questionText[index]}   onChange={handleInputChange}  onBlur={handleBlur}  autoFocus className="editable-input"/>
                                    : 
                            <>
                                <p>{question}</p>
                                <MoreHorizIcon style={{ cursor: "pointer", marginLeft: "auto" }} onClick={() => toggleOptions(index)} />
                            </>
                        }
                        {
                            showOptions === index 
                                    && 
                            <div className="popoverContainer"  style={{ marginBottom: "-30%" }}>
                                <p className="popover-option" id='popover-option1' onClick={() => handleShareClick(index)}>  <img src={share} style={{ marginBottom: "-12%" }} /> &nbsp;&nbsp;&nbsp; Share  </p>
                                <p className="popover-option" id='popover-option2' onClick={() => handleRenameClick(index)}>  <img src={edit} style={{ marginBottom: "-43%" }} /> &nbsp;&nbsp;&nbsp;&nbsp; Rename  </p>
                                <p  className="popover-option" id='popover-option3' onClick={() => handleDeleteClick(index)}>  <img  src={deletChat}  style={{ marginBottom:"-9%"}}/> &nbsp;&nbsp;&nbsp;  Delete </p> 
                            </div>
                        }
                    </div>  
                ))
            }

   {/* ------------------------------------------------Share Pop-up ----------------------------------------------*/}
            {
                showPopup === "share" && popupQuestionIndex !== null && showModal && 

                <Modal  show={showModal} onHide={handleClose} size="xxl" scrollable centered >
                    <Modal.Body className="sharePopUp">
                        <div >
                            <h6>Share information {popupQuestionIndex + 1}</h6>
                            <p className="sharePopUpP">   Send an invitation to your team members. Send directly via email or copy link. </p>
                            
                            <div className="shareLinkDiv">
                                <input  type="text"   value={`https://example.com/question/${popupQuestionIndex}`}    />
                                <button >Copy Link</button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                
            }

            
   {/* ------------------------------------------------Delete Pop-up ----------------------------------------------*/}
   {
                showPopup === "delete" && popupQuestionIndex !== null && showModal && 

                <Modal  show={showModal} onHide={handleClose} size="xxl" scrollable centered >
                    <Modal.Body className="sharePopUp" style={{textAlign:"center", alignItems:"center"}}>
                        <div >
                            <h6>Delete Conversation? {popupQuestionIndex + 1}</h6>
                            <p className="sharePopUpP">Are you sure you want to delete this Conversation?</p>
                            <div className="deleteDiv">
                                <button  id='deleteDivDelete' onClick={handleConfirmDelete}>Delete</button>
                                <button  id='deleteDivCancel' onClick={handleClosePopup}>Cancel</button>
                            </div>   
                        </div>
                    </Modal.Body>
                </Modal>
                
            }
     
        </div>
    );
}    



export default InsightPreviousChat
