import React from 'react'
import './BlankVendor.css'
import blankpeople from '../../../assets/blankpeople.svg'
import AddIcon from '@mui/icons-material/Add';


function BlankVendor() {
  return (
    <div className='BlankVendorDiv'>
         
         <div className='BlankVendorInsideDiv'>
             <img src={blankpeople} id='blankpeople'/><br/>
             <span>No Vendors Found</span><br/>
             <button className='BlankVendorButton'> <AddIcon style={{ fontSize: '16+6spx'}}/>&nbsp;&nbsp;Add Vendor</button>
         </div>
    </div>
  )
}

export default BlankVendor