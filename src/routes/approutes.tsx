import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import WhitelistUser from '../pages/whitelist-user';
import VerifyEmail from '../pages/VerifyEmail';
import Login from '../pages/Login';
import Dashboard from '../pages/dashboard';
import ProtectedRoute from './ProtectedRoute';


const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whitelist" element={<WhitelistUser />} />    
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path='/login' element={<Login/>}     />
        <Route path='/main' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}   />

    </Routes>
  );
};

export default AppRoutes;
