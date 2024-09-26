import React, { useState } from 'react';
import  "./AQ.css";
import update from '../../assets/update.svg';
import upload from '../../assets/upload.svg';
import filter from '../../assets/filter.svg';
import crop from '../../assets/crop.svg';
import { Table } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import { PaginationItem } from '@mui/material';



function AQ() {

  const [activeButton, setActiveButton] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(1); // State for active pagination item
  const [itemsPerPage] = useState(5);   



  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };


  const data = [
    { id: 1, col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4', col5: 'Data 5', col6: 'Data 6' },
    { id: 2, col1: 'Data 1', col2: 'Data 2', col3: 'Data 3', col4: 'Data 4', col5: 'Data 5', col6: 'Data 6' },
  ];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage1 = 10; // Number of items per page
  const totalItems = 99; // Example total number of items (coins)

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    setCurrentPage(value);
    // Fetch or update your data for the new page here
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage1);

  return (
    <div>
      <nav className='AQNavbar'>
            <h4 className='AQHeading'>  Approval Queue </h4>

            <div className='AQNavbarSideButtons'> 
              <button className='AQNavbarUpdateButton'>  <img src={update} /> Update</button>
              <button className='AQNavbarUploadButton'>   <img src={upload} /> Upload_Bill</button>
            </div>
      </nav>


     <div className='AQBelowHeading'>
        <div className='AQAcceptAndDecline'>
          <button className={`AQAllDiv ${activeButton === 'all' ? 'active' : ''}`}
            onClick={() => handleButtonClick('all')}>
            <div className='insideAQAllDiv'>
                 <img src={crop} style={{ width: "0.9em", height: "2em" , color:"black"}} /> <span>All</span>
            </div>

             <p>21</p>
          </button>

          <button className={`AQDeclineDiv ${activeButton === 'declined' ? 'active' : ''}`}
            onClick={() => handleButtonClick('declined')}>
            <div className='insideAQDeclineDiv '>
                 <img src={crop} style={{ width:"0.9em", height: "2em" }} /> <span>Declined</span>
            </div>

             <p>21</p>
          </button>
        </div>

         <button className='AQfilter'>
             <img src={filter} style={{ width:"0.9em", height: "2em" }} /> <span>Filter</span>
         </button>

     </div>


      <div>
          <div className="container mt-4 d-flex flex-column align-items-center outerTableDiv">
            <Table   className="custom-width">
              <thead>
                <tr>
                  {/* <th><input type="checkbox" /></th> */}
                  <th><input type="checkbox" />&nbsp;&nbsp;&nbsp;Vendor Name</th>
                  <th>Bill Number</th>
                  <th>Bill Date</th>
                  <th>Inbox Method</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id}>
                    <td>  <input type="checkbox" />  <img  src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"/>
                     &nbsp;&nbsp;&nbsp;{item.col1}</td>
                    <td>{item.col2}</td>
                    <td>{item.col3}</td>
                    <td>{item.col4}</td>
                    <td>{item.col5}</td>
                    <td>{item.col6}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
        </div>
      </div>


      <div className="pagination-div">
          <Pagination
            className='AQPagination'
            count={totalPages}
            page={pageNumber}
            onChange={handlePageChange}
          />
      </div>
     
    </div>
  )
}

export default AQ