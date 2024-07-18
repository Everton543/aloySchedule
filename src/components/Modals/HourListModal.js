import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import './modalOverlay.css';

const HourListModal = ({ isOpen, onRequestClose, schedules, onHourClick }) => {
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

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, i18n]);

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{t('chooseAnHourTitle')}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onRequestClose}></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group">
                            {schedules.map((schedule, index) => (
                                <li key={index} className="list-group-item">
                                    <button className="btn btn-link" onClick={() => onHourClick(schedule)}>
                                        {schedule.startTime}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onRequestClose}>{t('btnClose')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HourListModal;
