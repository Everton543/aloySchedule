import React, { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import $ from 'jquery';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import Logo from '../../components/Logo/Logo';
import PrimaryButton from '../../components/Button/PrimaryButton';
import styles from './SignUp.module.css';

function SignUp() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    const handleSignUp = () => {
        let email = $("#email").val();
        let password = $("#password").val();

        if (!email || !password) {
            PNotifyAlert({
                text: 'Email and password are required.',
                type: 'error'
            });
            return;
        }
        $.ajax({
            url: '/ajax/clients/create-account/',
            method: 'POST',
            data: { email, password, name: ''},
            success: function(response) {
                if (response.created) {
                    window.location.href = response.returnPage;
                } else {
                    PNotifyAlert({
                        text: 'This account already exists.',
                        type: 'error'
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                PNotifyAlert({
                    text: 'Error at sign up: ' + errorThrown,
                    type: 'error'
                });
            }
        });
    };

    return (
        <main className="container">
            <div className="row align-items-start">
                <div className="col">
                    <h1 className='text-center'>{t('signUpTitle')}</h1>
                    <div className="form-group">
                        <label htmlFor="email">{t('tagEmailInput')}</label>
                        <input type="text" className="form-control" id="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t('tagPasswordInput')}</label>
                        <div className="input-group">
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                            />
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <PrimaryButton onClick={handleSignUp} className={styles.primary_button}>{t('btnSignUp')}</PrimaryButton>
                    </div>
                </div>
                <div className="col">
                    <Logo />
                </div>
            </div>
        </main>
    );
}

export default SignUp;
