import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function App() {
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
        <h1>{t('welcome')}</h1>
        </main>
    );
}

export default App;