import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useTranslation } from 'react-i18next';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './modalOverlay.css';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const ScheduleFormModal = ({ isOpen, onRequestClose, selectedName,selectedPhone, service, hour, date, services, clientLink,logedIn,reloadEvents }) => {
    const [name, setName] = useState(selectedName);
    const [phone, setPhone] = useState(selectedPhone);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedService, setSelectedService] = useState(service);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            const searchParams = new URLSearchParams(window.location.search);
            const lang = searchParams.get('lang');
            if (lang && i18n.language !== lang) {
                i18n.changeLanguage(lang);
            }
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        setName(selectedName);
        setPhone(selectedPhone);
        setSelectedService(service);

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, i18n]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const scheduleDate = new Date(date);
        const dayOfWeek = scheduleDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }).toLowerCase();
        
        const scheduleData = {
            clientLink: clientLink,
            dayOfWeek: dayOfWeek,
            startTime: hour,
            endTime: calculateEndTime(hour),
            date,
            name,
            phone,
            email,
            password,
            serviceId: selectedService
        };
        try {
            $.ajax({
                url: '/ajax/user/add-schedule',
                method: 'POST',
                data: scheduleData,
                success: function(response) {
                    PNotifyAlert({
                        text: t('alertScheduleCreatedSuccessfully'),
                        type: 'success'
                    });
                    if(!logedIn){
                        window.location.reload();
                    }
                    reloadEvents(); // Call the function to reload events
                    onRequestClose();
                },
                error: function(error) {
                    PNotifyAlert({
                        text: t(error.responseJSON.message || 'errorMsgSystem'),
                        type: 'error'
                    });
                }
            });
        } catch (error) {
            console.error('Error creating schedule:', error);
        }
    };

    const calculateEndTime = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endTime = new Date();
        endTime.setHours(hours);
        endTime.setMinutes(minutes + 30); // Assuming a 30-minute service duration
        return endTime.toTimeString().substring(0, 5);
    };

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Schedule</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onRequestClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className='row'>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Date</label>
                                    <input type="date" className="form-control" value={date} readOnly />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Hour</label>
                                    <input type="text" className="form-control" value={hour} readOnly />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">{t('tagName')}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        id="name"
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Phone</label>
                                    <InputMask
                                        type="text"
                                        className="form-control"
                                        value={phone}
                                        mask={t('maskPhone')}
                                        onChange={(e) => setPhone(e.target.value)}
                                        
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Service</label>
                                <select
                                    className="form-select"
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                >
                                    <option value="">Select a service</option>
                                    {services.map((service, index) => (
                                        <option key={index} value={service._id}>
                                            {`${service.serviceName} - ${t('tagMoneyicon')}${service.servicePrice}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(!logedIn) ? (
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">{t('tagEmailInput')}</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            id="email"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label">{t('tagPasswordInput')}</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            id="password"
                                            required
                                        />
                                    </div>

                                </div>
                            ): (
                                ''
                            )}
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleFormModal;