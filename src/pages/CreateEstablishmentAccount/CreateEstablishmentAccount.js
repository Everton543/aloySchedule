import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import Logo from '../../components/Logo/Logo'; 
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import styles from './CreateEstablishmentAccount.module.css';


function CreateEstablishmentAccount() {
    const { t, i18n} = useTranslation();
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    const hangleChooseLink = () => {
        let clientLink = $("#chosen-link").val();

        $.ajax({
            url: '/ajax/clients/check-link/',
            method: 'GET',
            data: { clientLink: clientLink },
            success: function(response) {
                if (response.isUnique) {
                    window.location.href = '/singup';
                } else {
                    PNotifyAlert({
                        text: 'The link is already in use. Please choose a different link.',
                        type: 'error'
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                PNotifyAlert({
                    text: 'Error checking the link: ' + errorThrown,
                    type: 'error'
                });
            }
        });
    };
    return (
        <main className="container">
            <div className="row align-items-start">
                <div className="col">
                    <h1 className='text-center'>{t('createAccountTitle')}</h1>
                    <h2 className='text-center'>{t('createAccountSubTitle')}</h2>
                    <div className={styles.buttonContainer}>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">{process.env.REACT_APP_BASE_URL}/.</span>
                            <input type="text" className="form-control" id="chosen-link" aria-describedby="basic-addon3 basic-addon4" placeholder={t('tagStoreLink')}/>
                        </div>
                        <PrimaryButton onClick={hangleChooseLink} className={`${styles.primary_button}`}>{t('btnGetLink')}</PrimaryButton>
                        <div>
                            <Link to="/login" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">{t('btnLogin')}</Link>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <Logo />
                </div>
            </div>
        </main>
    );
}

export default CreateEstablishmentAccount;