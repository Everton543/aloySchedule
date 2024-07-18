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

const ServiceForm = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
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
                    url: '/ajax/clients/get-service-by-id',
                    method: 'GET',
                    data: { "_id": id },
                    success: function(response) {
                        setServicePrice(response.servicePrice);
                        setServiceName(response.serviceName);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        if(id == null){
            const serviceName = $("#serviceName").val();
            const servicePrice = $("#servicePrice").val();
            $.ajax({
                url: '/ajax/clients/save-service',
                method: 'POST',
                data: {serviceName, servicePrice},
                success: (data) => {
                    window.location.href = "/list-service";
                },
                error: (error) => {
                    let errorMessage = (error.responseJSON && error.responseJSON.message) ? error.responseJSON.message : 'errorMsgSystem';
                    PNotifyAlert({
                        text: t(errorMessage),
                        type: 'error'
                    });
                }
            });
        }else{
            const serviceName = $("#serviceName").val();
            const servicePrice = $("#servicePrice").val();
            $.ajax({
                url: '/ajax/clients/edit-service',
                method: 'POST',
                data: {
                    _id: id,
                    serviceName,
                    servicePrice
                },
                success: (data) => {
                    window.location.href = "/list-service";
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

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="container mt-5">
            <NavbarClient clientLink={clientLink}></NavbarClient>
            <h1 className="mb-4">{(id != null) ? t('editServiceTitle'): t('createServiceTitle')}</h1>
            <form id="serviceForm" onSubmit={handleSubmit}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">{t('tagServiceName')}</label>
                    <input
                        type="text"
                        id="serviceName"
                        className="form-control"
                        value={serviceName}
                        onChange={e => setServiceName(e.target.value)}

                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="servicePrice" className="form-label">{t('tagServicePrice')}</label>
                    <input
                        type="number"
                        id="servicePrice"
                        className="form-control"
                        value={servicePrice}
                        onChange={e => setServicePrice(e.target.value)}
                    />
                </div>
            </div>
                <button type="submit" className="btn btn-primary">{t('btnConfirm')}</button>
            </form>
        </div>
    );
};

export default ServiceForm;