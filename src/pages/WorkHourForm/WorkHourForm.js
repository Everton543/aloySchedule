import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavbarClient from '../../components/Navbar/NavbarClient'; 
import LoadingSpinner from '../../components/LoadingSpinner';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const WorkHourForm = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [selectedDays, setSelectedDays] = useState([]);
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('00:00');
    const [serviceDuration, setServiceDuration] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const [clientLink, setClientLink] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    useEffect(() => {
        if (!hasFetched) {
            setHasFetched(true);
            $.ajax({
                url: '/ajax/user/get-logged-user-info',
                method: 'GET',
                success: function(response) {
                    setClientLink(response.clientLink);
                    if (!id) {
                        setLoading(false);
                    }
                },
                error: function(error) {
                    PNotifyAlert({
                        text: t(error.responseJSON.message || 'errorMsgSystem'),
                        type: 'error'
                    });
                }
            });
            if (id) {
                $.ajax({
                    url: '/ajax/clients/get-work-hour-by-id',
                    method: 'GET',
                    data: { "_id": id },
                    success: function(response) {
                        setSelectedDays([response.dayOfWeek]);
                        setStartTime(response.startTime);
                        setEndTime(response.endTime);
                        setServiceDuration(response.serviceDuration);
                        setLoading(false);
                    },
                    error: function(error) {
                        PNotifyAlert({
                            text: t(error.responseJSON.message || 'errorMsgSystem'),
                            type: 'error'
                        });
                    }
                });
            }
        }
    }, [loading, hasFetched, id]);


    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (id) {
            setSelectedDays([value]);
        } else {
            setSelectedDays(prevState =>
                prevState.includes(value)
                    ? prevState.filter(day => day !== value)
                    : [...prevState, value]
            );
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(id == null){
            const workHours = selectedDays.map(day => ({
                dayOfWeek: day,
                startTime,
                endTime,
                serviceDuration
            }));
    
            $.ajax({
                url: '/ajax/clients/save-workHour',
                method: 'POST',
                data: JSON.stringify({
                    workHours
                }),
                contentType: 'application/json',
                success: (data) => {
                    window.location.href = "/list-work-hour";
                },
                error: (error) => {
                    PNotifyAlert({
                        text: t(error.responseJSON.message || 'errorMsgSystem'),
                        type: 'error'
                    });
                }
            });
        }else{
            const workHour = {
                dayOfWeek: selectedDays[0],
                startTime,
                endTime,
                serviceDuration
            };
            $.ajax({
                url: '/ajax/clients/edit-work-hour',
                method: 'POST',
                data: JSON.stringify({
                    _id: id,
                    workHour
                }),
                contentType: 'application/json',
                success: (data) => {
                    window.location.href = "/list-work-hour";
                },
                error: (error) => {
                    PNotifyAlert({
                        text: t(error.responseJSON.message || 'errorMsgSystem'),
                        type: 'error'
                    });
                }
            });
        }
    };

    const timeOptions = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 10) {
            const hour = String(i).padStart(2, '0');
            const minute = String(j).padStart(2, '0');
            timeOptions.push(`${hour}:${minute}`);
        }
    }

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="container mt-5">
            <NavbarClient clientLink={clientLink}></NavbarClient>
            <h1 className="mb-4">{(id != null) ? t('editWorkHourTitle'): t('createWorkHourTitle')}</h1>
            <form id="scheduleForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">{t('tagDaysOfWeek')}</label>
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
                                        checked={selectedDays.includes(day)}
                                    />
                                    <label htmlFor={day} className="form-check-label">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="startTime" className="form-label">{t('tagStartTime')}</label>
                    <select id="startTime" className="form-select" value={startTime} onChange={e => setStartTime(e.target.value)}>
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="endTime" className="form-label">{t('tagEndTime')}</label>
                    <select id="endTime" className="form-select" value={endTime} onChange={e => setEndTime(e.target.value)}>
                        {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="serviceDuration" className="form-label">{t('tagServiceDuration')}</label>
                    <input
                        type="number"
                        id="serviceDuration"
                        className="form-control"
                        min="10"
                        value={serviceDuration}
                        onChange={e => setServiceDuration(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">{t('btnConfirm')}</button>
            </form>
        </div>
    );
};

export default WorkHourForm;