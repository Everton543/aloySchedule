import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import Login from '../pages/Login/Login';
import CreateEstablishmentAccount from '../pages/CreateEstablishmentAccount/CreateEstablishmentAccount';
import SignUp from '../pages/SignUp/SignUp';
import WorkHourForm from '../pages/WorkHourForm/WorkHourForm';
import WorkHourList from '../pages/WorkHourList/WorkHourList';
import ServiceForm from '../pages/ServiceForm/ServiceForm';
import ServiceList from '../pages/ServiceList/ServiceList';
import ClientDetailsForm from '../pages/ClientDetailsForm/ClientDetailsForm';
import Logoff from '../pages/Logoff';
import SchedulesList from '../pages/SchedulesList/SchedulesList';
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/:clientLink?" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/create-bussiness-account" element={<CreateEstablishmentAccount />} />
        <Route path="/singup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logoff" element={<Logoff />} />
        <Route path="/details" element={<ClientDetailsForm />} />
        <Route path='/save-work-hour' element={<WorkHourForm/>} />
        <Route path='/edit-work-hour/:id?' element={<WorkHourForm/>} />
        <Route path='/list-work-hour' element={<WorkHourList/>} />
        <Route path='/list-service' element={<ServiceList/>} />
        <Route path='/list-schedule' element={<SchedulesList/>} />
        <Route path='/save-service' element={<ServiceForm/>} />
        <Route path='/edit-service/:id' element={<ServiceForm/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;