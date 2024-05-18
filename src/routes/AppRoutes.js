import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import Login from '../pages/Login';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/:clientName?" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login/:clientName?" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;