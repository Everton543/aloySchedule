import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavbarClient from '../../components/Navbar/NavbarClient'; 
import LoadingSpinner from '../../components/LoadingSpinner';
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import WorkHourCard from '../../components/WorkHourCard';
import style from './WorkHourList.module.css';
import classNames from 'classnames';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const WorkHourList = () => {
    const { t, i18n} = useTranslation();
    const [loading, setLoading] = useState(true); 
    const [hasFetched, setHasFetched] = useState(false); 
    const [workHours, setWorkHours] = useState([]);
    const [clientLink, setClientLink] = useState(''); 

    const getClientWorkHours = (link, alert)=>{
        $.ajax({
            url: '/ajax/clients/get-work-hours',
            method: 'GET',
            data: {clientLink: link},
            success: function(response) {
                setWorkHours(response);
                setLoading(false);
                if(alert !== ''){
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
                    if(response.alert){
                        alert = response.alert;
                    }
                    setClientLink(response.clientLink);
                    getClientWorkHours(response.clientLink, alert);
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
        <div className="container">
            <NavbarClient clientLink={clientLink}></NavbarClient>
            <header className='d-flex mb-4 justify-content-between align-items-center p-3 border-bottom'>
                <h1 className="m-0">{t('workHoursTitle')}</h1>
                <a href='/save-work-hour'><PrimaryButton>{t('btnClientAddWorkHours')}</PrimaryButton></a>
            </header>
            <div className={classNames("container", style.workHourCardsListContainer)}>
                {workHours.map(workHour => (
                    <WorkHourCard key={workHour._id} workHour={workHour} />
                ))}
            </div>
        </div>
    );
};

export default WorkHourList;