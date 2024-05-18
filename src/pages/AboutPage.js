import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';

function AboutPage() {
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
            <h1>{t('aboutTitle')}</h1>
        </main>
    );
}

export default AboutPage;