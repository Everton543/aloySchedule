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
import InputMask from 'react-input-mask';


const ClientDetailsForm = () => {
    const { t, i18n } = useTranslation();
    const [clientName, setClientName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const [clientLink, setClientLink] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    useEffect(() => {
        if(clientLink[0] == '.'){
            setLink(clientLink.slice(1));
        }else{
            setLink(clientLink);
        }
        if (!hasFetched) {
            setHasFetched(true);
            $.ajax({
                url: '/ajax/user/get-logged-user-info',
                method: 'GET',
                success: function(response) {
                    setClientLink(response.clientLink);
                },
                error: function(error) {
                    PNotifyAlert({
                        text: t(error.responseJSON.message || 'errorMsgSystem'),
                        type: 'error'
                    });
                }
            });
            $.ajax({
                url: '/ajax/clients/client/0',
                method: 'GET',
                success: function(response) {
                    setClientName(response.clientName);
                    setEmail(response.email);
                    setWhatsApp(response.phone);
                    setAddress(response.address);
                    if(response.clientLink[0] == '.'){
                        setLink(response.clientLink.slice(1));
                    }else{
                        setLink(response.clientLink);
                    }
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
    }, [loading, hasFetched]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('chamou');
        const chosenLink = $("#chosen-link").val();
        const clientName = $("#clientName").val(); 
        const address = $("#address").val(); 
        const email = $("#email").val(); 
        const phone = $("#phone").val(); 
        $.ajax({
            url: '/ajax/clients/edit-client',
            method: 'POST',
            data: {
                clientName,
                address,
                email,
                phone,
                clientLink: chosenLink
            },
            success: (data) => {
                PNotifyAlert({
                    text: t('alertClientUpdatedSuccessfully'),
                    type: 'success'
                });
                setLink(chosenLink);
            },
            error: (error) => {
                PNotifyAlert({
                    text: t(error.responseJSON.message || 'errorMsgSystem'),
                    type: 'error'
                });
            }
        });
    };

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="container mt-5">
            <NavbarClient clientLink={clientLink}></NavbarClient>
            <h1 className="mb-4">{t('establishmentInfoTitle')}</h1>
            <form id="ClientDetailsForm" onSubmit={handleSubmit}>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">{t('tagMyLink')}</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon3">{process.env.REACT_APP_BASE_URL}/.</span>
                        <input type="text" className="form-control" id="chosen-link" aria-describedby="basic-addon3 basic-addon4" placeholder={t('tagStoreLink')}
                        value={link} 
                        onChange={e => setLink(e.target.value)}
                        required/>
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="clientName">{t('tagClientName')}</label>
                    <input
                        type="text"
                        id="clientName"
                        className="form-control"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}

                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="email" className="form-label">{t('tagEmailInput')}</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">{t('tagWhatsApp')}</label>
                    <InputMask
                        type="text"
                        className="form-control"
                        value={whatsApp}
                        mask={t('maskPhone')}
                        id="phone"
                        onChange={(e) => setWhatsApp(e.target.value)}
                    />
                </div>
                <div className="col-md-12">
                    <label htmlFor="address" className="form-label">{t('tagAddress')}</label>
                    <textarea 
                        id="address"
                        className="form-control"
                        onChange={(e) => setAddress(e.target.value)}
                    >{address}</textarea>
                </div>
            </div>
                <button type="submit" className="btn btn-primary">{t('btnConfirm')}</button>
            </form>
        </div>
    );
};

export default ClientDetailsForm;