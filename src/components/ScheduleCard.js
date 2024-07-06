import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import PrimaryButton from './Button/PrimaryButton';
import $ from 'jquery';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

function ScheduleCard ({ schedule }){
    const { t, i18n} = useTranslation();
    const { _id, dayOfWeek, startTime, endTime, serviceDuration } = schedule;
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    const handleDelete = () =>{
        $.ajax({
            url: '/ajax/clients/delete-work-hour',
            method: 'POST',
            data: {
                _id: _id
            },
            success: function(response) {
                window.location.reload();
            },
            error: function(error) {
                PNotifyAlert({
                    text: t(error.responseJSON.message || 'errorMsgSystem'),
                    type: 'error'
                });
            }
        });
    }

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h5 className="card-title">{t('tagDay')}: {dayOfWeek}</h5>
            </div>
            <div className="card-body">
                <p className="card-text">{t('tagStartTime')}: {startTime}</p>
                <p className="card-text">{t('tagEndTime')}: {endTime}</p>
                <p className="card-text">{t('tagServiceDuration')}: {serviceDuration} {t('tagMinutes')}</p>
            </div>
            <div className='card-footer'>
                <a href={`/edit-work-hour/${_id}`}>
                    <PrimaryButton>{t('btnEditSchedule')}</PrimaryButton>
                </a>

                <button className='btn btn-danger' onClick={handleDelete}>{t('btnDelete')}</button>
            </div>
        </div>
    );
};
export default ScheduleCard;
