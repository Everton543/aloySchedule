import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import $ from 'jquery';
import styles from './HomePage.module.css';
import Logo from '../../components/Logo/Logo'; 
import NavbarClient from '../../components/Navbar/NavbarClient'; 
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import { Link } from 'react-router-dom';
import FullCalendarComponent from '../../components/FullCalendarComponent/FullCalendarComponent';
import { alert as PNotifyAlert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

function HomePage() {
    const { clientLink } = useParams();
    const { t, i18n} = useTranslation();
    const [hasFetched, setHasFetched] = useState(false); 
    const [dashboardOwner, setDashboardOwner] = useState(false); 
    const [logedIn, setLogedIn] = useState(false); 
    const [services, setServices] = useState([]); 
    const [locale, setLocale] = useState(i18n.language); 

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
            setLocale(i18n.language);
        }
    }, [i18n]);

    useEffect(() => {
        if (clientLink != null && !hasFetched) {
            setHasFetched(true);
            $.ajax({
                url: '/ajax/user/take-client-schedule',
                method: 'GET',
                data: { clientLink: clientLink },
                success: function(response) {
                    setDashboardOwner(response.dashboardOwner);
                    setLogedIn(response.logedIn);
                    setServices(response.services);
                },
                error: function(error) {
                    PNotifyAlert({
                        text: t(error.responseJSON.message || 'errorMsgSystem'),
                        type: 'error'
                    });
                }
            });
        }
    }, [clientLink, hasFetched]);

    const handleBussinessAccountClick = () => {
        window.location.assign('/create-bussiness-account');
    };

    return (
        <main>
            {!clientLink ? (
                <div>
                    <Logo />
                    <div className="container">
                        <p>{t('welcomeBody')}</p>
                        <ul className="list-group list-group-flush">
                            {t('welcomeList', { returnObjects: true }).map((item, index) => (
                                <li className="list-group-item" key={index}>{item}</li>
                            ))}
                        </ul>
                        <p>{t('welcomeFooter')}</p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <PrimaryButton onClick={handleBussinessAccountClick}>{t('linkCreateEstablishmentAccount')}</PrimaryButton>
                        <div>
                            <Link to="/login" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">{t('btnLogin')}</Link>
                        </div>
                    </div>
                </div>
            ) : (
                dashboardOwner ? (
                    <div>
                        <NavbarClient clientLink={clientLink}></NavbarClient>
                        <div id="dashboard-owner-content">
                            <FullCalendarComponent clientLink={clientLink} locale={locale} services={services}/>
                        </div>
                    </div>
                ) : (
                    <p>{clientLink}</p>
                )
            )}
        </main>
    );
}

export default HomePage;