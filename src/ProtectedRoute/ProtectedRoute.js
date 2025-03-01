import React, { useEffect, useState } from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../AuthContext/AuthContext';
import axios from "axios"
import { apiEndPointUrl } from '../utils/apiService';
import { roles } from '../utils/constant';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
  const role =sessionStorage.getItem('role');
    
  axios.defaults.withCredentials = true;
  const token = localStorage.getItem('authToken');  // Retrieve token from storage


  const checkAuth = () => {
    axios.get(`${apiEndPointUrl}/`, {
      headers: {
        Authorization: `Bearer ${token}`  // Set Bearer token in Authorization header
      }
    }) // Adjust the endpoint accordingly
      .then(res => {
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

    if (isAuthenticated && location.pathname === '/') {
      return <Navigate to={role == roles.approver1 || role ==roles.approver2 ?"/billAQButton":"/invoiceQueue"} replace />;
    }
  
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  
export default ProtectedRoute;
