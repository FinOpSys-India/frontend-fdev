import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Demo() {

   
    const [name, setName] = useState("Don't know !")
    const [accessControl, setAccessControl] = useState({
        generalAccess: "",
        notification: "",
        page1: ""
    });


    const handle= ()=>{
        if(accessControl.notification){
            alert("I'm a developer !")
        }
    }

    const handleName= ()=>{
        if(accessControl.page1){
            alert("Pratibha")
          }
    }
    function fetching(){
        axios.get("http://localhost:9000/get-accessControl")
        .then(res => {

            console.log(res.data);

            const fetchData = res.data;
            return setAccessControl({...accessControl,
                generalAccess: fetchData.GENERALACCESS,
                notification: fetchData.NOTIFICATION,
                page1: fetchData.PAGE1,
            });
        })
        .catch(error => {
            console.error('There was an error fetching the access control data!', error);
        });
    }


    useEffect(() => {
      fetching()

    }, []);


    return (
        <div>
            {/* <p>General Access: {accessControl.generalAccess ? 'Enabled' : 'Disabled'}</p> */}
            <p>Notification: {accessControl.notification ? 'Enabled' : 'Disabled'}</p>
            <p>Page 1: {accessControl.page1 ? 'Enabled' : 'Disabled'}</p>
            <button onClick={handle}>Click it!</button>
            <br/><br/><br/>

            <button onClick={handleName}>Click it for name!</button>

        </div>
    );
}

export default Demo;
