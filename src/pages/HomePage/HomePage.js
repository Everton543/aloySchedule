import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import './HomePage.module.css';
import Logo from '../../components/Logo/Logo'; 
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import { Link } from 'react-router-dom';


function HomePage() {
    const { clientName } = useParams();
    const { t, i18n} = useTranslation();
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    const handleBussinessAccountClick = () => {
        window.location.assign('/create-bussiness-account');
    };

    return (
        <main>
            <Logo />
            {!clientName ? (
                <div>
                    <div className="container">
                        <p>{t('welcomeBody')}</p>
                        <ul className="list-group list-group-flush">
                            {t('welcomeList', { returnObjects: true }).map((item, index) => (
                                <li className="list-group-item" key={index}>{item}</li>
                            ))}
                        </ul>
                        <p>{t('welcomeFooter')}</p>
                    </div>
                    <div className="buttonContainer">
                        <PrimaryButton onClick={handleBussinessAccountClick}>{t('linkCreateEstablishmentAccount')}</PrimaryButton>
                        <div>
                            <Link to="/login" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">{t('btnLogin')}</Link>
                        </div>
                    </div>
                </div>
            ) : (
                <p>{clientName}</p>
            )}
        </main>
    );
}

export default HomePage;