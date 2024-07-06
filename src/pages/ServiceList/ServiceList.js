import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavbarClient from '../../components/Navbar/NavbarClient'; 
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const ServiceList = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const [services, setServices] = useState([]);
    const [clientLink, setClientLink] = useState('');

    const getServicesList = (alert) => {
        $.ajax({
            url: '/ajax/clients/get-services-list',
            method: 'GET',
            success: function(response) {
                setServices(response);
                setLoading(false);
                if (alert !== '') {
                    PNotifyAlert({
                        text: t(alert),
                        type: 'success'
                    });
                }
            },
            error: function(error) {
                PNotifyAlert({
                    text: t(error.responseJSON.message || 'errorMsgSystem'),
                    type: 'error'
                });
            }
        });
    };

    const deleteService = (id) => {
        $.ajax({
            url: '/ajax/clients/delete-service',
            method: 'POST',
            data: { _id: id },
            success: function(response) {
                PNotifyAlert({
                    text: t('serviceDeletedSuccess'),
                    type: 'success'
                });
                getServicesList('');
            },
            error: function(error) {
                PNotifyAlert({
                    text: t(error.responseJSON.message || 'errorMsgSystem'),
                    type: 'error'
                });
            }
        });
    };

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
                    let alert = '';
                    if (response.alert) {
                        alert = response.alert;
                    }
                    setClientLink(response.clientLink);
                    getServicesList(alert);
                },
                error: function(error) {
                    PNotifyAlert({
                        text: t(error.responseJSON.message || 'errorMsgSystem'),
                        type: 'error'
                    });
                }
            });
        }
    }, [loading, hasFetched]);

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="container mt-5">
            <NavbarClient clientLink={clientLink}></NavbarClient>
            <header className="d-flex mb-4 justify-content-between align-items-center p-3 border-bottom">
                <h1 className="m-0">{t('serviceTitle')}</h1>
                <a href='/save-service'><PrimaryButton>{t('btnClientAddService')}</PrimaryButton></a>
            </header>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">{t('tagServiceName')}</th>
                            <th scope="col">{t('tagServicePrice')}</th>
                            <th scope="col">{t('tagOptions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service._id}>
                                <td>{service.serviceName}</td>
                                <td>{service.servicePrice}</td>
                                <td>
                                    <a href={`/edit-service/${service._id}`} className="btn btn-sm btn-outline-primary me-2">
                                        <i className="bi bi-pencil"></i>
                                    </a>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => deleteService(service._id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceList;
