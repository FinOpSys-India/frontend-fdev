import React, { useState } from 'react'
import axios from "axios";
import  "./InsightMainChat.css";
import download from '../../../../assets/download.svg';
import thumbsDown from '../../../../assets/thumbs-down.svg'; 
import thumbsup from '../../../../assets/thumbs-up.svg'; 
import refresh from '../../../../assets/refresh.svg'; 
import copy from '../../../../assets/copy.svg';
import editPencil from '../../../../assets/editPencil.svg'; 
import sendIn from'../../../../assets/sendIn.svg'; 
import Home from '../../../../Home/Home';
import InsightNewChat from '../InsightNewChat/InsightNewChat';
import InsightPreviousChat from '../InsightPreviousChat/InsightPreviousChat';

function InsightMainChat() {

    const [ChatSuggestion, setChatSuggestion] = useState(false);
    const [buttonHover, setbuttonHover] = useState(false);  
    const [selectedContents, setSelectedContents] = useState([]); // Track multiple selected contents
    const [selectedSpan, setSelectedSpan] = useState("");
  
    const options = [
        { label: "Short Answer", content: "Short Answer ×" },
        { label: "Full Summary", content: "Full Summary ×" },
        { label: "Report", content: "Report ×" },
        { label: "Graph", content: "Graph ×" },
    ];


    const handleChatSuggestion=()=>{
        setChatSuggestion(!ChatSuggestion)
    }

    const handleSpanClick = (content) => {
        setSelectedContents((prevSelectedContents) => {
            if (prevSelectedContents.includes(content)) {
                return prevSelectedContents.filter((item) => item !== content);
            } else {
                return [...prevSelectedContents, content];
            }
        });
    };

  return (

    <div style={{display:"flex"}}>
        <Home currentPage="insight" />
        
        <div className='insightRightSide'>
            <p className='insightHeading'>Insta-Insight </p>

            <div  className='insightSection'>

                <div className='insight_Insta' >

                    {
                        true
                          ?
                        <div className="insightMainDiv" style={{backgroundColor:"red"}}>
                            <div className='insightMainQuestionDiv'> 
                                <div className='insightMainQDiv'> 
                                    <span id='Q'> Q</span> 
                                    {/* <p id='QP'>Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks..</p>  */}
                                    <p id='QP'>Tell me the total n.</p> 
                                  
                                    <div className='insightQIconDiv' > 
                                        <input type='checkbox' id='insightQInput'/> 
                                        <img src={editPencil}/> 
                                    </div>
                                </div>
                           
                                <div className='insightMainADiv'> 
                                    <span>A</span> <p>Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.Tell me the total number of invoice we receive in this weeks.</p> <div> <input type='checkbox' /> <img src={editPencil}/> </div>
                                </div>      
                            </div>  
                            
                              
                        </div>  
                          :
                        <InsightNewChat/>
                    }

                   <div className='AISuggestionDiv'>
                    {ChatSuggestion === true 
                              ? 
                        <>
                            {options.map((item, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleSpanClick(item.content)}
                                    className={selectedContents.includes(item.content) ? "AISuggestionSelected" : "AISuggestion"}
                                >
                                      {selectedContents.includes(item.content) ? item.content : item.label}
                                </span>
                            ))}
                        </>
                                 : 
                                ""
                    }
                    </div> 
                    <div className={ChatSuggestion ? 'insighInputDivclick' : 'insighInputDiv'}>
                        <input type='text'placeholder='Message Insta-AI' onClick={handleChatSuggestion}/>           
                         <button onMouseEnter={() => setbuttonHover(true)}  onMouseLeave={() => setbuttonHover(false)}  > { buttonHover ? <><img src={sendIn}/>        Ask AI</> : <img src={sendIn}/>} </button>
                    </div>
                </div>
            
                <InsightPreviousChat /> 
             
            </div>
            
        </div> 
   </div>
  )       
}  
export default InsightMainChat


