import React, { useState } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavbarClient from '../../components/Navbar/NavbarClient'; 

const ScheduleForm = ({ clientId }) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [serviceDuration, setServiceDuration] = useState('');

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        setSelectedDays(prevState =>
            prevState.includes(value)
                ? prevState.filter(day => day !== value)
                : [...prevState, value]
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const schedules = selectedDays.map(day => ({
            dayOfWeek: day,
            startTime,
            endTime,
            serviceDuration
        }));

        $.ajax({
            url: '/ajax/clients/save-schedule',
            method: 'POST',
            data: JSON.stringify({
                schedules
            }),
            contentType: 'application/json',
            success: (data) => {
                console.log('Schedules saved:', data);
            },
            error: (error) => {
                console.error('Error saving schedules:', error);
            }
        });
    };

    const timeOptions = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 10) {
            const hour = String(i).padStart(2, '0');
            const minute = String(j).padStart(2, '0');
            timeOptions.push(`${hour}:${minute}`);
        }
    }

    return (
        <div className="container mt-5">
            <NavbarClient></NavbarClient>
            <h1 className="mb-4">Work Schedule</h1>
            <form id="scheduleForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Days of the Week</label>
                    <div id="daysOfWeek" className="row">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                            <div className="col-md-4" key={day}>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id={day}
                                        value={day}
                                        className="form-check-input"
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={day} className="form-check-label">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="startTime" className="form-label">Start Time</label>
                    <select id="startTime" className="form-select" value={startTime} onChange={e => setStartTime(e.target.value)}>
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="endTime" className="form-label">End Time</label>
                    <select id="endTime" className="form-select" value={endTime} onChange={e => setEndTime(e.target.value)}>
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="serviceDuration" className="form-label">Service Duration (in minutes)</label>
                    <input
                        type="number"
                        id="serviceDuration"
                        className="form-control"
                        placeholder="Enter duration in minutes"
                        min="10"
                        value={serviceDuration}
                        onChange={e => setServiceDuration(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Schedule</button>
            </form>
        </div>
    );
};

export default ScheduleForm;