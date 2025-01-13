import React, { useState } from 'react'
import axios from "axios";
import  "./InsightNewChat.css";
import rightDoubleArrow from '../../../../assets/rightDoubleArrow.svg';
import editChat from '../../../../assets/editChat.svg'; 
import leftDoubleArrow from '../../../../assets/leftDoubleArrow.svg'; 
import sendIn from'../../../../assets/sendIn.svg'; 
import Home from '../../../../Home/Home';


function InsightNewChat() {

    const [selectedItem, setSelectedItem] = useState('All Vendors');
    const [isPreviousChatSection, setIsPreviousChatSection] = useState(false);


    const handlePreviousChatSection=()=>{
        setIsPreviousChatSection(!isPreviousChatSection)
    }

  return (

        <div id='insight_Insta'>
            <h6>Insta-Insight</h6>
            <div className='insight_Insta3Div'>
                <div className='insight_InstaEachDiv' >
                    <button > <img src={editChat}/>&nbsp;&nbsp;  Quick Questions</button>
                    <p className='insightParrticularQuestion'id='insightParrticularQuestion'>How many invoices we got from emails? </p>
                    <p className='insightParrticularQuestion'>Total number of invoices received on Monday </p>
                    <p className='insightParrticularQuestion'>Nearest Due-Date invoices</p>
                    <p className='insightParrticularQuestion'>Count total amount that we need to pay within this week.</p>
                    <p className='insightParrticularQuestion'>How many invoices we got from XYZ Company</p>
                </div>

                <div className='insight_InstaEachDiv'>
                    <button > <img src={editChat}/> &nbsp;&nbsp;Summary</button>
                    <p className='insightParrticularQuestion' id='insightParrticularQuestion'> How many invoices we got from emails? </p>
                    <p className='insightParrticularQuestion'>Total number of invoices received on Monday </p>
                    <p className='insightParrticularQuestion'>Nearest Due-Date invoices</p>
                    <p className='insightParrticularQuestion'>Count total amount that we need to pay within this week.</p>
                    <p className='insightParrticularQuestion'>How many invoices we got from XYZ Company</p>
                </div>


                <div className='insight_InstaEachDiv'>
                    <button > <img src={editChat}/>&nbsp;&nbsp; Graphs</button>
                    <p className='insightParrticularQuestion' id='insightParrticularQuestion'>How many invoices we got from emails? </p>
                    <p className='insightParrticularQuestion'>Total number of invoices received on Monday </p>
                    <p className='insightParrticularQuestion'>Nearest Due-Date invoices</p>
                    <p className='insightParrticularQuestion'>Count total amount that we need to pay within this week.</p>
                    <p className='insightParrticularQuestion'>How many invoices we got from XYZ Company</p>
                </div>

            </div>
        </div>  
  )       
}  
export default InsightNewChat


