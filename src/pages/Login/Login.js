import React, {  useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar/Navbar';
import Logo from '../../components/Logo/Logo'; 
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import $ from 'jquery';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import classNames from 'classnames';
import styles from './Login.module.css';

const Login = () => {
    const { t, i18n} = useTranslation();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    const handleLogin = () => {
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
            url: '/ajax/user/login',
            method: 'POST',
            data: { email, password},
            success: function(response) {
                if(response.returnPage){
                    window.location.href = response.returnPage;
                }else{
                    PNotifyAlert({
                        text: t('errorMsgSystem'),
                        type: 'error'
                    });
                }
            },
            error: function(error) {
                if(error.responseJSON.message){
                    PNotifyAlert({
                        text: t(`${error.responseJSON.message}`),
                        type: 'error'
                    });
                }else{
                    PNotifyAlert({
                        text: t('errorMsgSystem'),
                        type: 'error'
                    });
                    console.error(error);
                }
            }
        });
    };
    
    return (
        <div >
            <Navbar /> 
            <div>
                <Logo className={styles.logo_container}/>
                <div className={classNames('card', styles.login_container)}>
                    <div className="card-header">
                        <h1 className='text-center'>{t('loginTitle')}</h1>
                    </div>
                    <div className='card-body'>
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
                    </div>
                    <div className="card-footer text-center">
                        <PrimaryButton className={styles.btnLogin} onClick={handleLogin}>{t('btnLogin')}</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
