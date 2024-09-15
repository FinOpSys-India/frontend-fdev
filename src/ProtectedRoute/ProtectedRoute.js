import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext/AuthContext';
import axios from "axios"
import { apiEndPointUrl } from '../utils/apiService';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
  
    
  axios.defaults.withCredentials = true;


  const checkAuth = () => {
    axios.get(`${apiEndPointUrl}/`) // Adjust the endpoint accordingly
      .then(res => {

        console.log(res)
        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(err => {
        console.log(err)
        setIsAuthenticated(false);
      });
  };

 useEffect(() => {
    checkAuth();
  }, []);
  

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // or any loading indicator
    }
  
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  
export default ProtectedRoute;
