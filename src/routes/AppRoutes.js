import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import Login from '../pages/Login/Login';
import CreateEstablishmentAccount from '../pages/CreateEstablishmentAccount/CreateEstablishmentAccount';
import SignUp from '../pages/SignUp/SignUp';
import ScheduleForm from '../pages/ScheduleForm/ScheduleForm';
import ScheduleList from '../pages/ScheduleList/ScheduleList';
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/:clientLink?" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/create-bussiness-account" element={<CreateEstablishmentAccount />} />
        <Route path="/singup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/save-schedule' element={<ScheduleForm/>} />
        <Route path='/edit-schedule/:id?' element={<ScheduleForm/>} />
        <Route path='/list-schedule' element={<ScheduleList/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;