import { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import PrimaryButton from '../Button/PrimaryButton';
import SecondaryButton from '../Button/SecondaryButton';
import styles from './NavbarClient.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import $ from 'jquery';

function NavbarClient({ clientLink }) {
    const { t, i18n} = useTranslation();
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    const handleOpenServices = () => {
        let html = `
            <div>
                <p>Teste</p>
            </div>
        `;
        $("#dashboard-owner-content").html(html);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href={'/'+clientLink}>
                    <Logo className={styles.menuLogo}></Logo>
                </a>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className={classNames("nav-item", styles.menuItems)}>
                        <PrimaryButton className="nav-link"><a href='/list-work-hour'>{t('btnClientOpenWorkHours')}</a></PrimaryButton>
                    </li>
                    <li className={classNames("nav-item", styles.menuItems)}>
                        <PrimaryButton className="nav-link" onClick={handleOpenServices}>{t('btnClientOpenServices')}</PrimaryButton>
                    </li>
                    <li className={classNames("nav-item", styles.menuItems)}>
                        <PrimaryButton className="nav-link">{t('btnClientOpenContacts')}</PrimaryButton>
                    </li>
                    <li className="nav-item dropdown">
                        <SecondaryButton className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-gear-fill"></i>
                        </SecondaryButton>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
  }
  
  export default NavbarClient;