import React, { useState,useEffect, useRef } from "react";
import filter from "../../../assets/filter.svg";
import "./FilterSection.css";
import CalendarLogo from "../../../assets/calendar.svg";
import MethodLogo from "../../../assets/method.svg";
import KeywordLogo from "../../../assets/keyword.svg";
import AmountLogo from "../../../assets/amount.svg";
import DepartmentLogo from "../../../assets/department.svg";
import "react-datepicker/dist/react-datepicker.css";

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DatePicker from "react-datepicker";

const FilterDrawer = ({ onApplyFilters }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Date"); // Default filter tab
  const [filters, setFilters] = useState({
    dateRange: { from: null, to: null },
    keyword: "",
    amount: { equalTo: "", greaterThan: "", lessThan: "" },
    selectedMethods: [],
    selectedDepartments: [],
   });
   const initialFilters = {
    dateRange: { from: null, to: null },
    keyword: "",
    amount: { equalTo: "", greaterThan: "", lessThan: "" },
    selectedMethods: [],
    selectedDepartments: [],
  };

  const departmentOptions = [
    "IT Department",
    "Finance",
    "HR",
    "Marketing",
    "Sales",
  ];
  const methods = [
    "Email", "OCR", "Manual", "Chat"
  ]
  const filterDrawerRef = useRef(null);

  useEffect(() => {
    onApplyFilters(filters);
  }, [filters, onApplyFilters]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDrawerRef.current && !filterDrawerRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const resetFilters = () => {
    setFilters(initialFilters);
    setStartDate(null);
    setEndDate(null);
  };
  const formatDate = (date) => {
    return date ? date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : null;
  };
  const handleStartChange = (date) => {
    console.log(date);
    setStartDate(date);
    setFilters((prev) => ({
      ...prev,
      dateRange: { from: formatDate(date), to: formatDate(endDate) },
    }));
  };
  
  const handleEndChange = (date) => {
    setEndDate(date);
    setFilters((prev) => ({
      ...prev,
      dateRange: { from: formatDate(startDate), to: formatDate(date) },
    }));
  };
  const handleDateRangeChange = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { from: startDate, to: endDate },
    }));
    console.log(filters.dateRange);
  };

  const handleAmountChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      amount: { ...prev.amount, [field]: value },
    }));
  };
  const handleApply = () => {
    handleDateRangeChange();
    // onApplyFilters(filters);
    // setShowFilters(false); // Close the filter section after applying filters
  };

  const handleOptionChange = (optionType,option) => {
    setFilters((prev) => ({
      ...prev,
      [optionType]: prev[optionType]?.includes(option)
        ? prev[optionType].filter((opt) => opt !== option)
        : [...(prev[optionType] || []), option],
    }));
  };

  const renderFilterOptions = () => {
    switch (activeFilter) {
      case "Date":
        return (
          <>
            <div className="date-picker-container">
              <label htmlFor="date" className="date-label">
                Date
              </label>{" "}
              <div className="transaction-range-selector">
                <label>Show Transction for</label>{" "}
                <select className="transaction-period">
                  <option>Today</option>
                  <option>This Year</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="date-range">
                <div className="date-picker">
                  <label>From</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date)=>handleStartChange(date)}
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker-input"
                  />
                </div>
                <div className="date-picker">
                  <label>To</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date)=>handleEndChange(date)}
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker-input"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case "Keyword":
        return (
          <div className="recent-options-container">
            <div>
              <label htmlFor="keyword" className="keyword-label">
                Keyword
              </label>
              <input
                type="text"
                id="keyword"
                placeholder="Search for Company, Invoice number etc."
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
                className="search-input"
              />
            </div>

            <div>
              <label className="recent-label">Recent</label>
              {departmentOptions.map((option, index) => (
                <div key={index} className="option-item">
                  <input type="checkbox" id={`option-${index}`} />
                  <label htmlFor={`option-${index}`} className="option-label">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case "Amount":
        return (
          <div className="amount-container">
            <label htmlFor="amount" className="amount-label">
              Amount
            </label>{" "}
            <div className="input-group">
              <label className="input-label">Equal to</label>
              <input
                type="number"
                className="input-box"
                value={filters.amount.equalTo}
                placeholder="$400"
                onChange={(e) => handleAmountChange("equalTo", e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Greater than & Equal to</label>
              <input type="number" class="input-box" placeholder="$ 200" value={filters.amount.greaterThan}
              onChange={(e) => handleAmountChange("greaterThan", e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Less than & Equal to</label>
              <input type="number" class="input-box" placeholder="$ 800" value={filters.amount.lessThan}
              onChange={(e) => handleAmountChange("lessThan", e.target.value)} />
            </div>
          </div>
        );
        case "Method":
        return (
          <div className="department-section">
            <label className="department-label">Method</label>
            {methods.map((option, index) => (
              <div className="departments-values" key={index}>
                <input
                  type="checkbox"
                  checked={filters.selectedMethods.includes(option)}
                  onChange={() => handleOptionChange("selectedMethods", option)}
                />
                <label style={{ marginLeft: "5px" }}>{option}</label>
              </div>
            ))}
          </div>
        );
      case "Department":
        return (
          <div className="department-section">
            <label className="department-label">Departments</label>
            {departmentOptions.map((option, index) => (
              <div className="departments-values" key={index}>
                <input
                  type="checkbox"
                  checked={filters.selectedDepartments.includes(option)}
                  onChange={() => handleOptionChange("selectedDepartments",option)}
                />
                <label style={{ marginLeft: "5px" }}>{option}</label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ marginRight: "1%" }}>
      {/* Filter button */}
      <button onClick={() => setShowFilters(!showFilters)} className="filter">
        <img
          src={filter}
          alt="Filter"
          style={{ width: "0.9em", height: "2em", color: "#7939EF" }}
        />{" "}
        {showFilters ? "Hide" : "Filter"}
      </button>

      {showFilters && (
        <div className="filter-drawer" ref={filterDrawerRef}>
          <div className="filter-sidebar">
            <ul>
              <li
                onClick={() => setActiveFilter("Date")}
                className={activeFilter === "Date" ? "active" : ""}
              >
                <button>
                  <img src={CalendarLogo} />
                  Date
                </button>
              </li>
              <li
                onClick={() => setActiveFilter("Keyword")}
                className={activeFilter === "Keyword" ? "active" : ""}
              >
                <button>
                  <img src={KeywordLogo} />
                  Keyword
                </button>
              </li>
              <li
                onClick={() => setActiveFilter("Amount")}
                className={activeFilter === "Amount" ? "active" : ""}
              >
                <button>
                  {" "}
                  <img src={AmountLogo} />
                  Amount
                </button>
              </li>
              <li
                onClick={() => setActiveFilter("Method")}
                className={activeFilter === "Method" ? "active" : ""}
              >
                <button>
                  {" "}
                  <img src={MethodLogo} />
                  Method
                </button>
              </li>
              <li
                onClick={() => setActiveFilter("Department")}
                className={activeFilter === "Department" ? "active" : ""}
              >
                <button>
                  <img src={DepartmentLogo} />
                  Department
                </button>
              </li>
            </ul>
          </div>
          <div className="filterSection">
            <div className="filter-content">{renderFilterOptions()}</div>

            <div className="filter-actions">
              {/* <button onClick={handleApply} className="apply-button">
                Apply Filters
              </button> */}
              <button
                onClick={() => {
                  resetFilters();
                  setShowFilters(false)}}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDrawer;
