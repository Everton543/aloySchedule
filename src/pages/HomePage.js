import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Navbar from '../components/Navbar/Navbar';

function HomePage() {
    const { clientName } = useParams();
    const { t, i18n} = useTranslation();
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
        i18n.changeLanguage(lang);
        }
    }, []);
    return (
        <main>
            <Navbar /> 
            <h1>{t('welcome')}</h1>
            {!clientName ? (
                <p>Access without client</p>
            ) : (
                <p>{clientName}</p>
            )}
        </main>
    );
}

export default HomePage;