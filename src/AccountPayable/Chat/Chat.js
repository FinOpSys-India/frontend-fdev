import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import plusIcon from "../../assets/plusIcon.svg";
import micIcon from "../../assets/micIcon.svg";
import sendIcon from "../../assets/sendIcon.svg";
import messageIcon from "../../assets/messageIcon.svg";
import callIcon from "../../assets/callIcon.svg";
import crossButton from "../../assets/crossButton.svg";
import bigCross from "../../assets/bigCross.svg"
import { roles } from "../../utils/constant";
import copyChat from "../../assets/copyChat.svg";
import deleteChat from "../../assets/delete.svg";
import crossClose from "../../assets/crossClose.svg";
import replyChat from "../../assets/replyChat.svg";
import reply from "../../assets/reply.svg";
import square from "../../assets/square.svg";
import star from "../../assets/star.svg";
import "./Chat.css";
import { Dropdown, Modal, Table } from "react-bootstrap";
import { apiEndPointUrl } from "../../utils/apiService"
import crop from '../../assets/expandButton.svg';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import io from 'socket.io-client'
import { TextField,Typography,Box, Button} from "@mui/material";
import { spacing } from '@mui/system';
import { Form } from "react-bootstrap";
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
// Connect to the WebSocket server
const socket = io('http://localhost:9000');

pdfjs.GlobalWorkerOptions.workerSrc ="/pdf.worker.min.js";

function Chat({ caseId, fetchInvoices, closeChat, notDisabledChat, expandInChat}) {
  const [acitivityLogButton, setacitivityLogButton] = useState(true);
  const [chatcaseId, setchatcaseId] = useState("");
  const [showAcceptDecline, setShowAcceptDecline] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);
  const role = sessionStorage.getItem("role");
  const [chats, setChats] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [socket, setSocket] = useState(null);
  const [showSmallPreview, setShowSmallPreview] = useState(false);
  const [showSmallPreviewTable, setShowSmallPreviewTable] = useState(false);
  const [chatPersonName, setchatPersonName] = useState([]);
  const [showAcceptTextBox, setShowAcceptTextBox] = useState(false);
  const [text, setText] = useState("");
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [base64String, setBase64String] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyDetails, setReplyDetails] = useState(null);
const [replyClicked, setReplyClicked] = useState(false); 
const [showCheckbox, setShowCheckbox] = useState(false);
const [selectedIndices, setSelectedIndices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const maxLimit = 100;

  const handleTextChange = (event) => {
    if (event.target.value.length <= maxLimit) {
      setText(event.target.value);
    }
  };
  const MAX_FILE_SIZE = 500 * 1024 * 1024;

  const [file, setFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);

  const handleMessageChange = (inputValue) => {
    setNewMessage(inputValue);
    // Show Accept/Decline popup if "/" is entered
    if (
      inputValue.includes("/") &&
      (role == roles.approver1 || role == roles.approver2)
    ) {
      setShowAcceptDecline(true);
    } else {
      setShowAcceptDecline(false);
      setShowSecondaryDropdown(false);
    }
  };

  function acitivityLogClose() {
    setacitivityLogButton(false);
  }
  const acceptClickOnChat=()=>{
    showSmallPreview(true);
    showAcceptTextBox(true);
  }

  const handleAcceptClick = async () => {

    const newActivity = {
      chat_id: caseId,
      accpetedBy: workEmail,
      status: "Accept the invoice",
      role: role,
      timestamp: new Date().toISOString(),
    };

    
  console.log("newActivity1", newActivity)
    // Call API for Accept action
    try {
      const response = await axios.post(`${apiEndPointUrl}/accept`, {
        invoiceId: caseId, // Replace with the actual invoice ID field
        role: role,
      });
      if (response.status == 500 || response.status == 400) {
        toast.error("Error in accepting invoice !");
      } 
      if(response.status == 200) {
        toast.success('Bill successfully approved', { autoClose: 3000 });
        fetchInvoices();  
        closeChat();
      }
    } catch (error) {
      console.log("Error in accepting invoice:", error.response.data.message);
      toast.error(`${error.response.data.message}`);
    }

    setShowAcceptDecline(false); 
    

    // --------------------------------- 
    try {
      const response = await axios.post(`${apiEndPointUrl}/acitivity-log`,newActivity, {
        headers: {
          "Content-Type": "application/json",
        },

      });

      if(response.data.status===500 || response.data.status===400 ){
        toast.error('Error in acitivity log  !');
      }
      else{
        console.log(' acitivity-log', response.data);
        toast.success(`${response.data}`, { autoClose: 1500 });
      }
    } catch (error) {
      console.log('Error in acitivity-log', error.response.data.message);
      toast.error(`${error.response.data.message}`)
    }
  };


  const handleSecondaryOptionClick = async (option) => {
      try {
      const response = await axios.post(`${apiEndPointUrl}/decline`, {
        invoiceId: caseId, // Replace with the actual invoice ID field
        role: role,
        declineReason:option
      });
      if (response.status === 500 || response.status === 400) {
        toast.error("Status is already approved/ declined !");
      } 
      if(response.status == 200) {
        toast.success(`Bill successfully declined`, { autoClose: 500 });
        fetchInvoices(); 
        closeChat();
      }
    } catch (error) {
      console.log("Error declinedStatus invoice:", error.message);
    }
    setShowSecondaryDropdown(false);
  };


  const handleDeclineClick= ()=> {
    setShowSecondaryDropdown(true);
    setShowAcceptDecline(false);
  }
  

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${apiEndPointUrl}/chats/${caseId}`);
      setChats(response.data);
      console.log(response.data)
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const { errors } = rejectedFiles[0];
      if (errors[0]?.code === "file-too-large") {
        toast.error("File size exceeds 10MB");
      }
    } else if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile); // Store the selected file
      handleDocClick(selectedFile); // Automatically start upload
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    accept:
      "application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg",
  });


  const handleDocClick = async (fileToUpload) => {
    if (!fileToUpload) {
      toast.error("Please select a file to upload.");
      return;
    }
    
     setFileDetails(fileToUpload);
  
    }
  
  


  const hideSmallPreview=()=>{
    setShowSmallPreview(false);
    setShowSmallPreviewTable(false);
    setShowAcceptTextBox(false);
  }


  const handleSendClick = async () => {
    if (!newMessage.trim() && !fileDetails) {
      return;
    }

    let newChat ={};

    if (replyClicked && replyDetails) {
        newChat = {
        chat_id: chatcaseId,
        user: workEmail,
        messages: newMessage,
        replyingUser : replyDetails.user,
        replyingUserMessage : replyDetails.messageSnippet,
        timestamp: new Date().toISOString(),
        replyClicked: true,
      };

      setReplyClicked(false)
    }
     else{
       newChat = {
        chat_id: chatcaseId,
        user: workEmail,
        messages: newMessage,
        timestamp: new Date().toISOString(),
      };
    }

    console.log("new", newChat)

    const formData = new FormData();
    formData.append('file', fileDetails); 
    formData.append('newChat', JSON.stringify(newChat));
    
    setNewMessage("");

    
    console.log("fileData", newChat)

    try {
      const response = await axios.post(`${apiEndPointUrl}/message`, formData, {
        // headers: {
        //   "Content-Type": "application/json",
        // },
        headers: {
          "Content-Type": "multipart/form-data", // Ensure 'newChat' is properly formatted as FormData if sending file data
        },
        withCredentials: true, 
      });
      // setFileDetails(null)
      socket.emit('sendMessage', newChat);  
      setChats((prevChats) => ({
        ...prevChats,
        MESSAGES: [...prevChats.MESSAGES, newChat],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
    fetchChats();
};    

  useEffect(() => {
    let email = document.cookie.split("; ").find((row) => row.startsWith("workEmail="))?.split("=")[1];
    setWorkEmail(email);
    setchatcaseId(caseId)

    fetchChats();



    const newSocket = io('http://localhost:9000');  // Socket connection
    newSocket.on('connect', () => {
    });

    newSocket.on('newMessage', (message) => {
        setChats((prevChats) => ({
            ...prevChats,
            MESSAGES: [...prevChats.MESSAGES, message],
        }));
    });

    // Error handling for socket connection
    newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    // Set socket in state
    setSocket(newSocket);  // Save the socket connection in the state

    // Cleanup function to disconnect the socket on component unmount
    return () => {
        newSocket.disconnect();
    };

  }, [caseId]);



  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    const isToday = messageDate.toDateString() === today.toDateString();

    if (isToday) {
      return "Today";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const fetchChatPerson = async () => {
    try {
        const response = await axios.get(`${apiEndPointUrl}/get-chatPerson`);
        console.log("Response data:", response);
        
        if (response.status === 200 && response.data) {
            setchatPersonName(response.data); // Ensure `setChatPersonName` is properly defined
        } else {
            console.error("Unexpected response structure:", response);
        }
    } catch (error) {
        console.error("Error fetching chat person:", error.message || error);
    }
};


// ----------handleCheckboxChange--------------------
const handleCheckboxChange = (role) => {
  setSelectedPersons((prevSelected) =>
    prevSelected.includes(role)
      ? prevSelected.filter((r) => r !== role) // Remove if already selected
      : [...prevSelected, role] // Add if not selected
  );
};


const handleItemClick = (e) => {
  e.stopPropagation(); // Prevent dropdown from closing
};

const toggleDropdown = () => {
  setIsOpen((prev) => !prev);
};


  useEffect(()=>{
    fetchChatPerson()
  },[selectedPersons])

  const downloadFile = (fileData,fileName ) => {
    // const dataUri = `data:application/octet-stream;base64,${fileData}`;
    
    // const link = document.createElement('a');
    // link.href = dataUri;
    // link.download = fileName;  // Set the file name

    // // Programmatically click the link to trigger the download
    // link.click();

    const byteCharacters = atob(fileData); // Decode Base64
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob with the appropriate type
    const blob = new Blob([byteArray]);

    // Create a download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  
  };


// -------------------------------------------------------------------------------------------
  // Function to copy the message to the clipboard
const handleCopy = (message) => {
  navigator.clipboard.writeText(message);
};

function handleDelete(chat) {
  setSelectedChat(chat); // Store the chat to delete
  setShowDeleteModal(true); // Show modal
}

 const confirmDelete = async ()=>  {
  const messageIndex =   chats.MESSAGES.findIndex(
    (message) => message.timestamp === selectedChat.timestamp
  );

  
  console.log("messageIndex",messageIndex)

  if (messageIndex !== -1) {
    const updatedMessages = [...chats.MESSAGES];
    updatedMessages.splice(messageIndex, 1);

    // setChats({
    //   ...chats,
    //   MESSAGES: updatedMessages,
    // });

    
  console.log("updatedMessages",updatedMessages)
  }

  

  try {
    const response = await axios.post(`${apiEndPointUrl}/delete-message`, { 
      chat_id: caseId,
      messageIndex: messageIndex, 
      timestamp: selectedChat.timestamp },{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    });
    
    console.log("response sending message:", response);
    // setFileDetails(null)
    // socket.emit('sendMessage', newChat);  
    // setChats((prevChats) => ({
    //   ...prevChats,
    //   MESSAGES: [...prevChats.MESSAGES, newChat],
    // }));
  } catch (error) {
    console.error("Error sending message:", error);
  }
  fetchChats();
    

  setShowDeleteModal(false); // Close modal
}    

const handleReply = (chat) => {
  const truncatedMessage = chat.messages.split(" ").slice(0, 3).join(" ");
  setReplyDetails({
    user: chat.user,
    messageSnippet: truncatedMessage,
  });
  setReplyClicked(true); // Set replyClicked to true when reply is triggered
};

const handleSelect = (message) => {
  setShowCheckbox(!showCheckbox);
};


const handleCheckbox = (index) => {
  setSelectedIndices((prevSelected) =>
    prevSelected.includes(index)
      ? prevSelected.filter((i) => i !== index) // Remove if already selected
      : [...prevSelected, index] // Add if not selected
  );
  console.log("setSelectedIndices", selectedIndices)
};
const handleClearSelectedMessage = () => {
   setSelectedMessage(null); // Clear the selected message
};


  return (
    <div className="PendiingBillChat">
      <div className="PendiingBillChatNavbar">
        <div className="billNumberAndpeople">
          <span id="billNoBill">Bill</span>
          <span id="billParticipant">{caseId}</span>
        </div>

        <div className="chatIcon">
            <Dropdown  >
                <Dropdown.Toggle  id="" className="pendingBillCall">
                    <img id="callIcon" src={callIcon} style={{fontSize: "29px"}} />
                </Dropdown.Toggle>

                <Dropdown.Menu className='chatPersonMenu'>
                  <Dropdown.Item className='' ><span>Members</span></Dropdown.Item>
                  
                  {
                    chatPersonName.map((person, index) => (
                    <Dropdown.Item key={index} className="chatPerson"  onClick={handleItemClick}>
                      {person.ROLE} <Form.Check type="checkbox" onChange={() => handleCheckboxChange(person.ROLE)}  checked={selectedPersons.includes(person.ROLE)}/>
                    </Dropdown.Item>
                  ))
                  }
                  <Dropdown.Item className='chatPersonItemButton'><button className='chatPersonButton'  onClick={() => console.log("Selected Persons:", selectedPersons)}>Call Group</button></Dropdown.Item>          
                </Dropdown.Menu>
            </Dropdown>
          <img
            className="messageAndCross"
            style={{ fontSize: "21px" }}
            src={messageIcon}
          />
          <img
            className="messageAndCross"
            style={{ fontSize: "19px" }}
            src={crossButton}
            onClick={closeChat}

          />
        </div>
        
      </div>

      <div className="chatContent">
        <div id="chatContainer">
        {showSmallPreview ?<div className="chat-modal-overlay">
            <div className="chat-modal">
              <div className="cross-expand-button">
              
              <button className="close-button" onClick={hideSmallPreview}>
                <img src={bigCross}/>
              </button>
              {!showAcceptTextBox?<button className="close-button" onClick={()=>expandInChat(caseId)}>
              <img src={crop} />
              </button>:null}
              </div>
              {showAcceptTextBox
                        ?
               <div>
                  <Typography marginLeft="7%" required style={{ fontFamily: "Inter" }} >Please add a note*</Typography>
                      <TextField id="outlined-textarea" value={text} onChange={handleTextChange} multiline rows={4}
                        InputProps={{   style: { padding: '8px', margin:"0% 8%" }}}
                        style={{
                          width: '100%',
                          margin: '0 auto', 
                        }}  required
                      />
                          <Typography  variant="caption"
                            sx={{
                              display: 'block',
                              textAlign: 'right',
                              marginRight : '10%',
                              color: text.length === maxLimit ? 'red' : 'inherit',
                            }}
                          >
                            {text.length}/{maxLimit}
                          </Typography>
                      {text!=""? <button className = "acceptButtonOnModel" 
                        style={{
                          display: "block", 
                          marginLeft: "auto", 
                          marginRight: "10%",
                        }}
                      onClick={handleAcceptClick}>Accept</button>:null}
                </div>
                      :
                       null
              }
              {showSmallPreviewTable 
                    ? 
               <div className="mt-1 d-flex flex-column align-items-center">
                  <Table   className="PreviewdescriptionTableInChat">
                    <thead>
                      <tr  className="PreviewdescriptionTheadInChat">
                        <th>Bill Number</th>
                        <th>Rate</th>
                        <th>Qty</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key=""  className='PreviewdescriptionDataInChat'>
                          <td>invoice.billId</td>
                          <td>invoice.Method</td>
                          <td>invoice.amount</td>
                          <td>invoice.col6</td>
                        </tr>
                        <tr key=""  className='PreviewdescriptionDataInChat'>
                          <td>invoice.billId</td>
                          <td>invoice.Method</td>
                          <td>invoice.amount</td>
                          <td>invoice.col6</td>
                        </tr>
                        <tr key=""  className='PreviewdescriptionDataInChat'>
                          <td>invoice.billId</td>
                          <td>invoice.Method</td>
                          <td>invoice.amount</td>
                          <td>invoice.col6</td>
                        </tr>
                    </tbody>
                  </Table>
                </div>:null}
              </div>
          </div>:null}
          {chats?.MESSAGES?.length > 0 && chats.MESSAGES.map((chat, index) => {
            const currentDate = new Date(chat.timestamp).toDateString();
            const previousDate =
              index > 0 ? new Date(chats.MESSAGES[index - 1]?.timestamp).toDateString() : null;
          
            // Show date only if it's the first message or the date changes
            const showDate = index === 0 || currentDate !== previousDate;

            return (
              <React.Fragment key={index}>
               
                {/* Render the date once per day */}
                {showDate && (
                  <h6 className="chatDay">{formatTimestamp(chat.timestamp)}</h6>
                )}

                {chat.user === workEmail ? (
                  // Sender's chat
                  <div className="personChatDetail">
                    <div className="chatNameAndPic">
                      {/* <img className='chatNameAndPic' src='https://img.freepik.com/premium-vector/default-avatar-profile-silhouette-vector-illustration_561158-3408.jpg' /> */}
                    </div>

                    { chat.replyClicked   === true 
                             ?
                      <div className="messageWrapper">
                         {showCheckbox && <input type="checkbox" checked={selectedIndices.includes(index)} onChange={() => handleCheckbox(index)}/>}
                      <div className="messageAndTime">
                        <span className="personName">{chat.user}</span>
                        <div className="personMessageAndTime">
                            <div  className="replyBoxDiv">
                            <div className="replyBox">
                              <div  className="Box">
                                <p> <img src={replyChat} style={{  width:"10px", marginTop:"0"}} /> <span>{chat.replyingUser}</span> <br/>  </p>
                                <button onClick={() => setReplyDetails(null)}></button><br/>
                              </div>
                              <span>{chat.replyingUserMessage}...</span>
                            </div>
                          </div>
                          <span className="personMessage">{chat.messages}
                            {chat.fileData  ? 
                              <button  className="fileData" onClick={ ()=> downloadFile(chat.fileData, chat.fileName)} >
                                      {chat?.fileName}<br/><FileDownloadIcon style={{fontSize:"21px"}}/>
                                </button>  
                              : 
                              ""
                            }
                          </span>

                          <span className="messageTime">
                            {new Date(chat.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="optionsMenu">
                        <input type="checkbox" className="messageCheckbox" />
                        <div className="optionsList">
                            <button className="option" onClick={() => handleCopy(chat.messages)}> <img src={copyChat} style={{  width:"12.9px"}}/>  &nbsp; Copy</button>
                            <button className="option" onClick={() => handleReply(chat)}> <img src={reply} style={{  width:"12.9px"}}/> &nbsp; Reply</button>
                            <button className="option" onClick={() => handleSelect(chat)}> <img src={square} style={{  width:"12.9px"}}/> &nbsp; Select</button> 
                            <button className="option" onClick={() => handleReply(chat)}> <img src={star} style={{  width:"12.9px"}}/> &nbsp; Star</button>
                            <button className="option" onClick={() => handleDelete(chat)}> <img src={deleteChat} style={{  width:"12.9px"}}/> &nbsp; Delete</button> 
                        </div>
                      </div>
                    </div>
                             :
                      <div className="messageWrapper">
                            {showCheckbox && <input type="checkbox" checked={selectedIndices.includes(index)} onChange={() => handleCheckbox(index)}/>}
                        <div className="messageAndTime">
                          <span className="personName">{chat.user}</span>
                          <div className="personMessageAndTime">
                            <span className="personMessage">{chat.messages}
                              {chat.fileData  ? 
                                <button  className="fileData" onClick={ ()=> downloadFile(chat.fileData, chat.fileName)} >
                                        {chat?.fileName}<br/><FileDownloadIcon style={{fontSize:"21px"}}/>
                                  </button>  
                                : 
                                ""
                              }
                            </span>

                            <span className="messageTime">
                              {new Date(chat.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="optionsMenu">
                          <input type="checkbox" className="messageCheckbox" />
                          <div className="optionsList">
                            <button className="option" onClick={() => handleCopy(chat.messages)}> <img src={copyChat} style={{  width:"12.9px"}}/>  &nbsp; Copy</button>
                            <button className="option" onClick={() => handleReply(chat)}> <img src={reply} style={{  width:"12.9px"}}/> &nbsp; Reply</button>
                            <button className="option" onClick={() => handleSelect(chat)}> <img src={square} style={{  width:"12.9px"}}/> &nbsp; Select</button> 
                            <button className="option" onClick={() => handleReply(chat)}> <img src={star} style={{  width:"12.9px"}}/> &nbsp; Star</button>
                            <button className="option" onClick={() => handleDelete(chat)}> <img src={deleteChat} style={{  width:"12.9px"}}/> &nbsp; Delete</button> 
                        </div>
                        </div>
                      </div>
                    }
                    {
                         showDeleteModal && (
                        <div className="modalOverlayInsideChat">
                          <div className="modalContentInsideChat">
                            <h6>Delete message?</h6>
                            <p>Are you sure you want to delete this message?</p>
                            <div className="buttonDeleteAndCancel">
                              <button onClick={confirmDelete} className="deleteButton">Delete</button>
                              <button onClick={() => setShowDeleteModal(false)} className="cancelButton">Cancel</button>
                            </div>  
                          </div>
                        </div>
                      )
                    }
                  </div>
                ) : (
                  // Receiver's chat
                  <div className="reciverPersonChatDetail">
                    <div className="reciverChatNameAndPic">
                      {/* <img className='reciverChatNameAndPic' src='https://img.freepik.com/premium-vector/default-avatar-profile-silhouette-vector-illustration_561158-3408.jpg' /> */}
                    </div>

                    <div className="messageWrapper">
                      <div className="reciverMessageAndTime">
                        <span className="reciverPersonName">{chat.user}</span>
                        <div className="reciverPersonMessageAndTime">
                          <span className="reciverPersonMessage">  {chat.messages}
                            {chat.fileData  ? 
                              <button  className="fileDataReciver" onClick={ ()=> downloadFile(chat.fileData, chat.fileName)} >
                                      {chat?.fileName}<br/><FileDownloadIcon style={{fontSize:"21px"}}/>
                                </button>  
                               : 
                              ""
                            }
                          </span>
                          <span className="reciverMessageTime">
                            {new Date(chat.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="optionsMenu">
                        <input type="checkbox" className="messageCheckbox" />
                        <div className="optionsList">
                            <button className="option" onClick={() => handleCopy(chat.messages)}> <img src={copyChat} style={{  width:"12.9px"}}/>  &nbsp; Copy</button>
                            <button className="option" onClick={() => handleReply(chat)}> <img src={reply} style={{  width:"12.9px"}}/> &nbsp; Reply</button>
                            <button className="option" onClick={() => handleSelect(chat)}> <img src={square} style={{  width:"12.9px"}}/> &nbsp; Select</button> 
                            <button className="option" onClick={() => handleReply(chat)}> <img src={star} style={{  width:"12.9px"}}/> &nbsp; Star</button>
                            <button className="option" onClick={() => handleDelete(chat)}> <img src={deleteChat} style={{  width:"12.9px"}}/> &nbsp; Delete</button> 
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          
        </div>
        {showAcceptDecline ? (
          <div>
          <Dropdown className="chatdropdownContainerApproveDecline">
          <Dropdown.Item
              eventKey="previewBill"
              onClick={()=>{setShowAcceptDecline(false);setShowSmallPreview(true);setShowSmallPreviewTable(true)}}
              className="chatDropdownEachItem"
            >  &nbsp;&nbsp; Preview
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="acceptBills"
              onClick={()=>{setShowAcceptDecline(false);setShowSmallPreview(true);setShowAcceptTextBox(true)}}
              className="chatDropdownEachItem"
            >
             ✓   &nbsp;&nbsp; Accept
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="declineBills"
              onClick={handleDeclineClick}
              className="chatDropdownEachItem"
            >
              ✕ &nbsp;&nbsp;  Decline
            </Dropdown.Item>
          </Dropdown>
          
          </div>
        ) : null}
        {showSecondaryDropdown && (
        <Dropdown className="chatdropdownContainerDecline">
          <Dropdown.Item
            eventKey="incorrectDetails"
            onClick={() => handleSecondaryOptionClick("Incorrect Details")}
            className="chatDropdownEachItem"
          >
            Incorrect Details
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="missingValues"
            onClick={() => handleSecondaryOptionClick("Missing Values")}
            className="chatDropdownEachItem"
          >
            Missing Values
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="calculationError"
            onClick={() => handleSecondaryOptionClick("Calculation Error")}
            className="chatDropdownEachItem"
          >
            Calculation Error
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="other"
            onClick={() => handleSecondaryOptionClick("Other")}
            className="chatDropdownEachItem"
          >
            Other
          </Dropdown.Item>
        </Dropdown>
      )}
        {notDisabledChat 
               ? 

         <>      
          {replyDetails && replyClicked ===true ? (
          <div  className="replyBoxDiv">
            <div className="replyBox">
              <div  className="Box">
                <p> <img src={replyChat} style={{  width:"10px", marginTop:"0"}} /> <span>{replyDetails.user}</span> <br/>  </p>
                <button onClick={() => setReplyDetails(null)}><img src={crossClose} style={{  width:"12px"}} /> </button><br/>
              </div>
              <span>{replyDetails.messageSnippet}...</span>
            </div>
          </div>
        ):""}
          <div className="AllChatIcon">
            <div {...getRootProps()}>
              <img id="plusChat"  style={{ width: "30px", height:"26px" }}  src={plusIcon} onClick={() => handleDocClick(file)} />
            </div> 
          
          
            <input  type="text" placeholder="Type your message" className="chatInputField" value={newMessage} onChange={(e) => handleMessageChange(e.target.value)} />
            <div className="micChatIconAndSend">
              <img style={{ fontSize: "26px" }}src={sendIcon}onClick={handleSendClick}  />
            </div>
          </div>
          </>
               :
          null
        }
      </div>
      <ToastContainer />
     </div>
  );
}
export default Chat;
