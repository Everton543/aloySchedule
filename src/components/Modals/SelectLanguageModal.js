import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './modalOverlay.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icons.min.css';

const LanguageLink = ({ lang, country, flagClass }) => {
    const handleClick = () => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('lang', lang);
        window.history.replaceState(null, '', '?' + searchParams.toString());
        window.location.reload();
    };

    return (
        <a href="#" onClick={handleClick} className="d-block mb-2">
            <span className={`flag-icon ${flagClass} me-2`}></span>
            {country}
        </a>
    );
};

const SelectLanguageModal = ({ isOpen, onRequestClose }) => {
    const { t, i18n } = useTranslation();


    useEffect(() => {
        if (isOpen) {
            const searchParams = new URLSearchParams(window.location.search);
            const lang = searchParams.get('lang');
            if (lang && i18n.language !== lang) {
                console.log(lang);
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
                        <h5 className="modal-title">{t('chooseLanguageTitle')}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onRequestClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <LanguageLink lang="en-US" country={t('countryUsa')} flagClass="flag-icon-us" />
                            </div>
                            <div className="col-md-3">
                                <LanguageLink lang="en-UK" country={t('countryUk')} flagClass="flag-icon-gb" />
                            </div>
                            <div className="col-md-3">
                                <LanguageLink lang="pt-BR" country={t('countryBrazil')} flagClass="flag-icon-br" />
                            </div>
                            <div className="col-md-3">
                                <LanguageLink lang="es-PY" country={t('countryParaguay')} flagClass="flag-icon-py" />
                            </div>
                            <div className="col-md-3">
                                <LanguageLink lang="es-AR" country={t('countryArgentina')} flagClass="flag-icon-ar" />
                            </div>

                            <div className="col-md-3">
                                <LanguageLink lang="es-ES" country={t('countrySpain')} flagClass="flag-icon-es" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onRequestClose}>{t('btnClose')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectLanguageModal;
