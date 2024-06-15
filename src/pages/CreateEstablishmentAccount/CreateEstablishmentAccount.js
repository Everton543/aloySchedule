import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../../components/Logo/Logo'; 
import PrimaryButton from '../../components/Button/PrimaryButton'; 
import { Link } from 'react-router-dom';
import './CreateEstablishmentAccount.css';


function CreateEstablishmentAccount() {
    const { t, i18n} = useTranslation();
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
        i18n.changeLanguage(lang);
        }
    }, [i18n]);
    return (
        <main className="container">
            <div className="row align-items-start">
                <div className="col">
                    <h1 className='text-center'>{t('createAccountTitle')}</h1>
                    <h2 className='text-center'>{t('createAccountSubTitle')}</h2>
                    <div>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">{process.env.REACT_APP_BASE_URL}/.</span>
                            <input type="text" className="form-control" id="chosen-link" aria-describedby="basic-addon3 basic-addon4" placeholder={t('tagStoreLink')}/>
                        </div>
                        <div>
                            <PrimaryButton>{t('btnGetLink')}</PrimaryButton>
                        </div>
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