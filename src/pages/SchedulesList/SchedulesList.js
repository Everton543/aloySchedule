import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavbarClient from '../../components/Navbar/NavbarClient'; 
import NavbarUser from '../../components/Navbar/NavbarUser';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScheduleCard from '../../components/ScheduleCard'; 
import classNames from 'classnames';
import { alert as PNotifyAlert } from '@pnotify/core';
import style from './ScheduleList.module.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const SchedulesList = () => {
    const today = new Date();
    const oneMonthLater = new Date();
    const oneMonthAgo = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [accountType, setAccountType] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [clientLink, setClientLink] = useState('');
    const [dateStart, setDateStart] = useState(oneMonthAgo.toISOString().split('T')[0]);
    const [dateEnd, setDateEnd] = useState(oneMonthLater.toISOString().split('T')[0]);

    const handleGetScheduleList = (alert) => {
        $.ajax({
            url: '/ajax/user/get-schedule-list',
            method: 'GET',
            data: {
                start: dateStart,
                end: dateEnd
            },
            success: function(response) {
                setSchedules(response);

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
                        console.log(response.alert);
                        alert = response.alert;
                    }
                    setClientLink(response.clientLink);
                    setAccountType(response.accountType);
                    handleGetScheduleList(alert);
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
            {(accountType == 'C') ? (
                <NavbarClient clientLink={clientLink}/>
            ):(
                <NavbarUser clientLink={clientLink}/>
            )}
            <header className="d-flex mb-4 justify-content-between align-items-center p-3 border-bottom">
                <h1 className="m-0">{t('scheduleListTitle')}</h1>
            </header>
            <div className="row mb-2">
                <div className="col-md-5">
                    <div className="input-group input-group-sm">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Start Date</span>
                        <input
                            type="date"
                            className="form-control"
                            aria-label="Start date input"
                            aria-describedby="inputGroup-sizing-sm"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="input-group input-group-sm">
                        <span className="input-group-text" id="inputGroup-sizing-sm">End Date</span>
                        <input
                            type="date"
                            className="form-control"
                            aria-label="End date input"
                            aria-describedby="inputGroup-sizing-sm"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-outline-secondary p-1" onClick={()=>{handleGetScheduleList('')}} type="button" id="button-search">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div className={classNames("container", style.scheduleListContainer)}>
                {schedules.map(schedule => (
                    <ScheduleCard key={schedule._id} schedule={schedule} />
                ))}
            </div>
        </div>
    );
};

export default SchedulesList;