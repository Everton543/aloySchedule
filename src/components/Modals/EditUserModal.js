import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import $ from 'jquery';
import './modalOverlay.css';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import LoadingSpinner from '../LoadingSpinner';

const EditUserModal = ({ isOpen, onRequestClose }) => {
    const { t, i18n } = useTranslation();
    const [selectedUser_id, setSelectedUser_id] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true); 
    const [hasFetched, setHasFetched] = useState(false); 


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

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, i18n]);

    useEffect(() => {
        if (!hasFetched) {
            setHasFetched(true);
            $.ajax({
                url: '/ajax/user/get-logged-user-info',
                method: 'GET',
                success: function(response) {
                    let alert = '';
                    setSelectedUser_id(response._id);
                    setEmail(response.email);
                    setName(response.name);
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

    const handleSubmitEditUser = async (e) => {
        e.preventDefault();
        try {
            if(password != '' || name != ''){
                $.ajax({
                    url: '/ajax/user/edit-user',
                    method: 'POST',
                    data: {
                        user_id: selectedUser_id,
                        password: password,
                        name: name
                    },
                    success: function(response) {
                        PNotifyAlert({
                            text: t('alertInformationUpdatedSuccessfully'),
                            type: 'success'
                        });
                        onRequestClose();
                    },
                    error: function(error) {
                        PNotifyAlert({
                            text: t(error.responseJSON.message || 'errorMsgSystem'),
                            type: 'error'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error creating schedule:', error);
        }
    };

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t('editAccountTitle')}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onRequestClose}></button>
                    </div>
                    <div className="modal-body">
                        <form id="ClientDetailsForm" onSubmit={handleSubmitEditUser}>
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="email" className="form-label">{t('tagEmailInput')}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        value={email}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" htmlFor="password">{t('tagNewPasswordInput')}</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        onChange={e => setPassword(e.target.value)}

                                    />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" htmlFor="password">{t('tagName')}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={name}
                                        onChange={e => setName(e.target.value)}

                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">{t('btnConfirm')}</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onRequestClose}>{t('btnClose')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;
