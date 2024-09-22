import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { apiEndPointUrl } from '../../utils/apiService';

const MemberRedirectIfAuthenticated = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const memberToken = localStorage.getItem('authToken');
  axios.defaults.withCredentials = true;
  
  const memberCheckAuth = () => {
    axios.get(`${apiEndPointUrl}/home-member`,{
        headers: {
          Authorization: `Bearer ${memberToken}`  // Set Bearer token in Authorization header
        }
      
    }) 
      .then(res => {

          console.log(res)
        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((err) => {

          console.log(err)
        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    memberCheckAuth();
  }, []);


  if (isAuthenticated === null) {
    return <div>Loading...</div>; // or any loading indicator
  }

  return isAuthenticated ? <Navigate to="/home-member" /> : children;
};

export default MemberRedirectIfAuthenticated;
