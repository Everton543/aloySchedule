import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './modalOverlay.css';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const ScheduleFormModal = ({ isOpen, onRequestClose, hour, date, services, reloadEvents }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        console.log(services);
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

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, i18n]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const scheduleData = { clientLink: '.everton', dayOfWeek: new Date(date).toLocaleString('en-US', { weekday: 'long' }).toLowerCase(), startTime: hour, endTime: calculateEndTime(hour), date, name, phone, serviceId: selectedService };
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
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input type="date" className="form-control" value={date} readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Hour</label>
                                <input type="text" className="form-control" value={hour} readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (123) 456-7890"
                                    required
                                />
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