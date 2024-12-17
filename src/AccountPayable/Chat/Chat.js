import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import plusIcon from "../../assets/plusIcon.svg";
import micIcon from "../../assets/micIcon.svg";
import sendIcon from "../../assets/sendIcon.svg";
import messageIcon from "../../assets/messageIcon.svg";
import callIcon from "../../assets/callIcon.svg";
import crossButton from "../../assets/crossButton.svg";
import { roles } from "../../utils/constant";
import "./Chat.css";
import { Dropdown } from "react-bootstrap";
import { apiEndPointUrl } from "../../utils/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";

function Chat({ caseId, fetchInvoices, closeChat}) {
  console.log(caseId)
  const [acitivityLogButton, setacitivityLogButton] = useState(true);
  const [chatcaseId, setchatcaseId] = useState("");
  const [showAcceptDecline, setShowAcceptDecline] = useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);
  const role = sessionStorage.getItem("role");
  const [chats, setChats] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [workEmail, setWorkEmail] = useState("");

  const MAX_FILE_SIZE = 500 * 1024 * 1024;

  const [file, setFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(new FormData());

  const handleMessageChange = (inputValue) => {
    setNewMessage(inputValue);
    // Show Accept/Decline popup if "/" is entered
    if (
      inputValue.includes("/") &&
      (role == roles.approver1 || role == roles.approver2)
    ) {
      setShowAcceptDecline(true);
      console.log(showAcceptDecline);
    } else {
      setShowAcceptDecline(false);
    }
  };

  function acitivityLogClose() {
    setacitivityLogButton(false);
  }

  const handleAcceptClick = async () => {
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

    setShowAcceptDecline(false); // Hide popup after Accept
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
      } else {
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
    console.log("fileToUpload :", fileToUpload);
    if (!fileToUpload) {
      toast.error("Please select a file to upload.");
      return;
    }

    setFileDetails(fileToUpload);
  };

  const handleSendClick = async () => {
    if (!newMessage.trim() && !fileDetails) {
      return;
    }

    const newChat = {
      chat_id: caseId,
      user: workEmail,
      messages: newMessage,
      timestamp: new Date().toISOString(),
      fileData: fileDetails,
    };
    setNewMessage("");

    try {
      const response = await axios.post(`${apiEndPointUrl}/message`, newChat, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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
    let email = document.cookie
      .split("; ")
      .find((row) => row.startsWith("workEmail="))
      ?.split("=")[1];
    setWorkEmail(email);
    fetchChats();
  }, [caseId  ]);

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

  return (
    <div className="PendiingBillChat">
      <div className="PendiingBillChatNavbar">
        <div className="billNumberAndpeople">
          <span id="billNoBill">Bill</span>
          <span id="billParticipant">{caseId}</span>
        </div>
        <div className="chatIcon">
          <div className="pendingBillCall">
            <img src={callIcon} style={{ fontSize: "30px" }} />
          </div>
          <img
            className="messageAndCross"
            style={{ fontSize: "19.9px" }}
            src={messageIcon}
          />
          <img
            className="messageAndCross"
            style={{ fontSize: "16px" }}
            src={crossButton}
            onClick={closeChat}

          />
        </div>
      </div>

      <div className="chatContent">
        <div id="chatContainer">
          {chats?.MESSAGES.map((chat, index) => {
            // Compare current chat timestamp with the previous one to show date once per day
            const showDate =
              index === 0 ||
              new Date(chat.timestamp).toDateString() !==
                new Date(chats[index - 1]?.timestamp).toDateString();

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

                    <div>
                      <div className="messageAndTime">
                        <span className="personName">{chat.user}</span>
                        <div className="personMessageAndTime">
                          <span className="personMessage">{chat.messages}</span>
                          <span>
                            {" "}
                            {chat.fileData && chat.fileData.path ? (
                              <img
                                src={`data:image/jpeg;base64,${chat.fileData}`}
                                alt="file"
                                onError={() =>
                                  console.log("Image failed to load")
                                }
                                style={{ width: "200px", height: "auto" }}
                              />
                            ) : (
                              ""
                            )}
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
                    </div>
                  </div>
                ) : (
                  // Receiver's chat
                  <div className="reciverPersonChatDetail">
                    <div className="reciverChatNameAndPic">
                      {/* <img className='reciverChatNameAndPic' src='https://img.freepik.com/premium-vector/default-avatar-profile-silhouette-vector-illustration_561158-3408.jpg' /> */}
                    </div>

                    <div>
                      <div className="reciverMessageAndTime">
                        <span className="reciverPersonName">{chat.user}</span>
                        <div className="reciverPersonMessageAndTime">
                          <span className="reciverPersonMessage">
                            {chat.messages}
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
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          
        </div>
        {showAcceptDecline ? (
          <div>
          <Dropdown className="chatdropdownContainer">
            
            <Dropdown.Item
              eventKey="acceptBills"
              onClick={handleAcceptClick}
              className="chatDropdownEachItem"
            >
              Accept
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="declineBills"
              onClick={handleDeclineClick}
              className="chatDropdownEachItem"
            >
              Decline
            </Dropdown.Item>
          </Dropdown>
          
          </div>
        ) : null}
        {showSecondaryDropdown && (
        <Dropdown className="chatdropdownContainer">
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
            eventKey="other"
            onClick={() => handleSecondaryOptionClick("Other")}
            className="chatDropdownEachItem"
          >
            Other
          </Dropdown.Item>
        </Dropdown>
      )}
         <div className="AllChatIcon">
          <div {...getRootProps()}>
            <img 
              id="plusChat"
              style={{ fontSize: "246px" }}
              src={plusIcon}
              onClick={() => handleDocClick(file)}
            />
          </div> 
          
          
          <input
            type="text"
            placeholder="Type your message"
            className="chatInputField"
            value={newMessage}
            onChange={(e) => handleMessageChange(e.target.value)}
          />
          <div className="micChatIconAndSend">
            <img style={{ fontSize: "27px" }} src={micIcon} />
            <img
              style={{ fontSize: "26px" }}
              src={sendIcon}
              onClick={handleSendClick}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
     </div>
  );
}
export default Chat;
