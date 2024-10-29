import React, { useState, useCallback } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";
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
// import PreviewSection from './PreviewSection/PreviewSection';
// import EditIcon from '@mui/icons-material/Edit';

function DeclineTable({filters, currentPage, itemsPerPage}) {
  // invoice---
  const [invoices, setInvoices] = useState([]);
  const [declineHoveredIndex, setdeclineHoveredIndex] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
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

  return (
    <div>
      <div className="mt-4 d-flex flex-column align-items-center outerTableDiv">
        <Table className="custom-width">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
                &nbsp;&nbsp;&nbsp;Vendor Name
              </th>
              <th>Bill Number</th>
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
                    id="sendActionOfdecline"
                    onMouseEnter={() => setdeclineHoveredIndex(index)}
                    onMouseLeave={() => setdeclineHoveredIndex(null)}
                  >
                    {declineHoveredIndex === index ? (
                      <>
                        {" "}
                        <img
                          src={sendHover}
                          style={{ width: "0.9em", height: "2em" }}
                        />{" "}
                        Send
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
    </div>
  );
}

export default DeclineTable;
