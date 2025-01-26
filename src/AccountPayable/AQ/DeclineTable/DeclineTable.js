import React, { useState, useCallback } from "react";
import "./DeclineTable.css";
import sendHover from "../../../assets/sendHover.svg";
import send from "../../../assets/send.svg";
import { apiEndPointUrl } from "../../../utils/apiService";
import { Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { DisplaySettings } from "@mui/icons-material";
import { useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, Button, Form } from 'react-bootstrap';
import deleteChat from "../../../assets/delete.svg";

function DeclineTable({filters, currentPage, itemsPerPage}) {
  // invoice---
  const [invoices, setInvoices] = useState([]);
  const [declineHoveredIndex, setdeclineHoveredIndex] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const [showVendorNameSearch, setShowVendorNameSearch] = useState(false);
  const [searchQueryByName, setSearchQueryByName] = useState('');
  const [selectedVendorName, setSelectedVendorName] = useState('');
  const [showCrossIcon, setShowCrossIcon] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBillNumberSearch, setShowBillNumberSearch] = useState(false);
  const [searchQueryByBillNumber, setSearchQueryByBillNumber] = useState('');
  const [selectedVendorBillNumber, setSelectedVendorBillNumber] = useState('');
  const [showCrossBillNumber, setShowCrossBillNumber] = useState(false);
  const [showDropdownBillNumber, setShowDropdownBillNumber] = useState(false);
  const [email, setEmail] = useState("prs89826@gmail.com");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(""); 
  const [show, setShow] = useState(false);
  const [isVendor, setIsVendor] = useState(true);

  const fetchOnlyDeclineInvoices = async () => {
    try {
      const response = await axios.get(
        `${apiEndPointUrl}/get-decline-invoices`
      );
      setInvoices(response.data);
      setFilteredData(response.data);
      console.log(response.data); // setTotalInvoices(response.headers['x-total-count']); // Assuming your API sends the total count in the header
    } catch (error) {
      toast.error("Failed to fetch invoices", { autoClose: 1500 });
    }
  };

  useEffect(() => {
    fetchOnlyDeclineInvoices();
  }, []);
  useEffect(() => {
    // Filter data based on selected filters
    let tempData = [...invoices];

    // Filter by date range
    if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
      tempData = tempData.filter((invoice) =>
        new Date(invoice.receivingDate) >= new Date(filters.dateRange.from) &&
        new Date(invoice.receivingDate) <= new Date(filters.dateRange.to)
      );
    }

    // Filter by keyword
    if (filters.keyword) {
      tempData = tempData.filter((invoice) =>
        invoice.vendorName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      invoice.billId.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    if (filters.amount) {
      if (filters.amount.equalTo) {
        tempData = tempData.filter((invoice) => invoice.amount === filters.amount.equalTo);
      }
      if (filters.amount.greaterThan) {
        tempData = tempData.filter((invoice) => invoice.amount >= filters.amount.greaterThan);
      }
      if (filters.amount.lessThan) {
        tempData = tempData.filter((invoice) => invoice.amount <= filters.amount.lessThan);
      }
    }

    // Filter by options
    if (filters.selectedMethods.length) {
      tempData = tempData.filter((invoice) => filters.selectedMethods.includes(invoice.inboxMethod));
    }

    if (filters.selectedDepartments.length) {
      tempData = tempData.filter((invoice) => filters.selectedDepartments.includes(invoice.department));
    }
    setFilteredData(tempData);
  }, [filters, invoices]);
  // ------------------------toottip vendor name---------------------
const handleMouseEnter = () => {
  setShowVendorNameSearch(true);  // Show search bar on hover
};
const handleMouseLeave = () => {
  setShowVendorNameSearch(false);  // Hide search bar when not hovered
};
const handleNameSearchChange = (e) => {
  setSearchQueryByName(e.target.value);
  setShowDropdown(e.target.value.length > 0);
  setShowCrossIcon(false); // Reset cross icon when typing
};
const handleVendorClick = (vendorName) => {
  setSelectedVendorName(vendorName);
  setSearchQueryByName(vendorName); // Set input value to selected vendor
  setShowCrossIcon(true); 
  setShowDropdown(false);
  
  const filtered = invoices.filter(invoice => invoice.vendorName.toLowerCase() === vendorName.toLowerCase());
  setFilteredData(filtered); 
    // setInvoices(filtered)
};
const clearSearch = () => {
  setSearchQueryByName('');
  setSelectedVendorName(''); // Clear selected vendor
  setShowCrossIcon(false); // Hide cross icon
  setShowDropdown(false);
  setFilteredData(invoices);
};
const filteredVendorNameInvoices = invoices.filter(invoice =>
  invoice.vendorName.toLowerCase().includes(searchQueryByName.toLowerCase())
);
// ------------------------toottip bill numbber---------------------
const handleMouseEnterBill = () => {
  setShowBillNumberSearch(true);  // Show search bar on hover
};
const handleMouseLeaveBill = () => {
  setShowBillNumberSearch(false);  // Hide search bar when not hovered
};
const handleBillNumberSearch = (e) => {
  setSearchQueryByBillNumber(e.target.value);
  setShowDropdownBillNumber(e.target.value.length > 0);
  setShowCrossBillNumber(false); // Reset cross icon when typing
};
const handleBillNumber = (billId) => {
  setSelectedVendorBillNumber(billId);
  setSearchQueryByBillNumber(billId); // Set input value to selected vendor
  setShowCrossBillNumber(true); 
  setShowDropdownBillNumber(false);
  
  const filtered = invoices.filter(invoice => invoice.billId.toLowerCase() === billId.toLowerCase());
  setFilteredData(filtered); 
    // setInvoices(filtered)
};
const clearBillNumber = () => {
  setSearchQueryByBillNumber('');
  setSelectedVendorBillNumber(''); // Clear selected vendor
  setShowCrossBillNumber(false); // Hide cross icon
  setShowDropdownBillNumber(false);
  setFilteredData(invoices);
};
const filteredBillNumberInvoices = invoices.filter(invoice =>
  invoice.billId.toLowerCase().includes(searchQueryByBillNumber.toLowerCase())
);
 
// ----------------------------------------handleSubmit-------------
 const handleClose = () => setShow(false);
 const handleShow = () => setShow(true);

 const handleSubmit = async (e) => {
  e.preventDefault();
  const emailData = {
    to: email,
    subject: subject,
    message: message,
  };

  console.log("emailData", emailData)

  try {
    const response = await axios.post(`${apiEndPointUrl}/send-email`, emailData);
    console.log("Email", response)
    if (response.data.success) {
      console.log("Email sent successfully!", response.data)
      setShow(false)
      toast.success(`${response.data.message}`, { autoClose: 1500 });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send email.");
  }
};


const handleDelete= ()=>{
  setEmail("prs89826@gmail.com");
 setSubject("");
  setMessage(""); 
}

  return (
    <div>
      <div className="mt-4 d-flex flex-column align-items-center outerTableDiv">
        <Table className="custom-width">
          <thead>
            <tr>
            <th  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ondata-toggle="tooltip" data-placement="bottom" >
                      <input type="checkbox"  />
                      &nbsp;&nbsp;&nbsp;Vendor Name
                     {
                               showVendorNameSearch 
                                       && 
                      <div className="vendorNameTooltip">
                        <div className="vendorNameSearchDiv">
                          <input id="vendorNameSearch"  type="text"  className="form-control" placeholder={selectedVendorName || "Search Vendor"} // Update placeholder
                              value={searchQueryByName} onChange={handleNameSearchChange}/>
                          {
                            showCrossIcon 
                                   ? 
                              <CloseIcon
                                style={{  fontSize: '19px',  position: 'absolute', top: '12px',left: '79%', color: 'black', cursor: 'pointer', }}  onClick={clearSearch}/>
                                  : 
                              <SearchIcon
                                style={{ fontSize: '19px', position: 'absolute', top: '12px', left: '79%',color: 'black', }}/>
                            }
                          {
                             showDropdown && searchQueryByName
                                       ? 
                              filteredVendorNameInvoices.length > 0 
                                          ? 
                              filteredVendorNameInvoices.map((invoice) => (
                                <div key={invoice.id} className="invoiceCard"  onClick={() => handleVendorClick(invoice.vendorName)} >
                                  <div className="vendorName" id='filterTooltip'>{invoice.vendorName}</div>
                                </div>
                              ))
                                              : 
                            <div className="noResults"  id='filterTooltip'>No matching invoices found</div>
                                                   : 
                                                ""
                          }
                        </div>
                      </div>
                    }
                    </th>
                    <th  onMouseEnter={handleMouseEnterBill} onMouseLeave={handleMouseLeaveBill} ondata-toggle="tooltip" data-placement="bottom" >
                      Bill Number
                     {
                               showBillNumberSearch 
                                       && 
                      <div className="vendorNameTooltip" id='billNumberAQTool'>
                        <div className="vendorNameSearchDiv">
                          <input id="vendorNameSearch"  type="text"  className="form-control" placeholder={selectedVendorBillNumber || "Search Bill"} // Update placeholder
                              value={searchQueryByBillNumber} onChange={handleBillNumberSearch}/>
                          {
                            showCrossBillNumber 
                                   ? 
                              <CloseIcon
                                style={{  fontSize: '19px',  position: 'absolute', top: '12px',left: '79%', color: 'black', cursor: 'pointer', }}  onClick={clearBillNumber}/>
                                  : 
                              <SearchIcon
                                style={{ fontSize: '19px', position: 'absolute', top: '12px', left: '79%',color: 'black', }}/>
                            }
                          {
                             showDropdownBillNumber && searchQueryByBillNumber
                                       ? 
                              filteredBillNumberInvoices.length > 0 
                                          ? 
                              filteredBillNumberInvoices.map((invoice) => (
                                <div key={invoice.id} className="invoiceCard"  onClick={() => handleBillNumber(invoice.billId)} >
                                  <div className="vendorName" id='filterTooltip'>{invoice.billId}</div>
                                </div>
                              ))
                                              : 
                            <div className="noResults"  id='filterTooltip'>No matching invoices found</div>
                                                   : 
                                                ""
                          }
                        </div>
                      </div>
                    }
                    </th>
              <th>Bill Date</th>
              <th>Inbox Method</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((invoice, index) => (
              <tr key={invoice.billId}>
                <td>
                  <input type="checkbox" />{" "}
                  <img
                    src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                    alt="Vendor Avatar"
                  />
                  &nbsp;&nbsp;&nbsp;{invoice.vendorName}
                </td>
                <td> {invoice.billId}</td>
                <td>{new Date(invoice.receivingDate).toLocaleDateString()} </td>
                <td> {invoice.inboxMethod}</td>
                <td> {invoice.amount}</td>
                <td id="ActionOfdecline">
                  <span
                    className="sendActionOfdecline"
                    id="sendActionOfdecline" onClick={handleShow}
                    onMouseEnter={() => setdeclineHoveredIndex(index)}
                    onMouseLeave={() => setdeclineHoveredIndex(null)}
                  >
                    {declineHoveredIndex === index ? (
                      <>
                        {" "}
                        <img src={sendHover}  style={{ width: "0.9em", height: "2em" }}  />{" "}  Send
                      </>
                    ) : (
                      <img
                        src={send}
                        style={{ width: "0.9em", height: "2em" }}
                      />
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={show} onHide={handleClose} centered>
          <Modal.Body>
            <h6>Email</h6>
            <div className="toggleEmail">
              <p>Send an mail to vendor</p>
              <div className="toggle-switch">
                <label className="d-inline-flex align-items-center">
                  <span>Company</span>
                  <div  className={`ms-2 toggle ${  isVendor ? "vendor" : "company" }`} onClick={() => setIsVendor(!isVendor)} >
                    <div className="circle"></div>
                  </div>
                  <span className="ms-2">Vendor</span>
                </label>
              </div>
            </div>

            <Form onSubmit={handleSubmit} >
              <Form.Group  className="emailTo" controlId="emailTo">
                <span className="to">To</span>
                <Form.Control  className="emailEmail" type="email"  placeholder="Joy@finopsys.ai"
                  value={email} onChange={(e) => setEmail(e.target.value)}/>
                <div  className="ccAndBcc"> <span className="cc" >cc</span>  <span className="bcc" >bcc</span></div>
                 
              </Form.Group>

              <Form.Group controlId="subject" className="mt-3">
                <Form.Control type="text" placeholder="Subject"   value={subject} onChange={(e) => setSubject(e.target.value)} />
              </Form.Group>

              <Form.Group controlId="message" className="mt-3">
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Message" value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex align-items-center mt-4" style={{gap:"3%" }}>
                  <button variant="primary" type="submit">
                     <img src={sendHover}/> {"   "}
                   Send
                  </button>
                  <div className="deleteChatButton"><img src={deleteChat}  onClick={handleDelete}/> </div>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
         <ToastContainer />
      </div>
  );
}

export default DeclineTable;

