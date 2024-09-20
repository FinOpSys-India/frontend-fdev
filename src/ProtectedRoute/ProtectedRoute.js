import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext/AuthContext';
import axios from "axios"

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
  
    
  axios.defaults.withCredentials = true;


  const checkAuth = () => {
    axios.get('http://localhost:9000/') // Adjust the endpoint accordingly
      .then(res => {

        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(err => {
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
