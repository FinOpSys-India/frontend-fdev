import React, { useState } from 'react'
import './BlankVendor.css'
import blankpeople from '../../../assets/blankpeople.svg'
import AddIcon from '@mui/icons-material/Add';
import AddVendorFormButton from '../AddVendorFormButton/AddVendorFormButton';


function BlankVendor() {
 const [showModal, setShowModal] = useState(false);


  
    //   -------handleAddVendor------------
    const addVendor = () => {
      setShowModal(true); // Show the modal
    };
  



  return (
    <div className='BlankVendorDiv'>
         
         <div className='BlankVendorInsideDiv'>
             <img src={blankpeople} id='blankpeople'/><br/>
             <span>No Vendors Found</span><br/>
             <button className='BlankVendorButton' onClick={addVendor}> <AddIcon style={{ fontSize: '16+6spx'}}/>&nbsp;&nbsp;Add Vendor</button>
             <AddVendorFormButton
                show={showModal}
                onHide={() => setShowModal(false)}
                // component={modalComponent}
               />
         </div>
    </div>
  )
}

export default BlankVendor