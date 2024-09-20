import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RedirectIfAuthenticated = ({ children }) => {
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
      .catch((err) => {

        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    checkAuth();
  }, []);


  if (isAuthenticated === null) {
    return <div>Loading...</div>; // or any loading indicator
  }

  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default RedirectIfAuthenticated;
