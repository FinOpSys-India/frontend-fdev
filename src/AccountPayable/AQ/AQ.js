import React, { useState } from 'react';
import  "./AQ.css";
import update from '../../assets/update.svg';
import upload from '../../assets/upload.svg';
import filter from '../../assets/filter.svg';
import crop from '../../assets/crop.svg';

function AQ() {

  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };


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


    </div>
  )
}

export default AQ