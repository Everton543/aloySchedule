import React, { useState, useEffect } from 'react';
import Logo from '../Logo/Logo';
import PrimaryButton from '../Button/PrimaryButton';
import SecondaryButton from '../Button/SecondaryButton';
import styles from './NavbarClient.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import $ from 'jquery';
import EditUserModal from '../Modals/EditUserModal';
import SelectLanguageModal from '../Modals/SelectLanguageModal';

function NavbarUser({ clientLink }) {
    const { t, i18n} = useTranslation();
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);
    const handleOpenEditModalClick = () => {
        setIsEditUserModalOpen(true);
    };

    const handleOpenLanguageModalClick = () => {
        setIsLanguageModalOpen(true);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href={'/'+clientLink}>
                    <Logo className={styles.menuLogo}></Logo>
                </a>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item dropdown">
                        <SecondaryButton className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-gear-fill"></i>
                        </SecondaryButton>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="/list-schedule" >{t('btnListSchedule')}</a></li>
                            <li><a className="dropdown-item" href="#" onClick={handleOpenLanguageModalClick}>{t('btnChooseLanguage')}</a></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><a className="dropdown-item" href="#" onClick={handleOpenEditModalClick}>{t('btnEditAccount')}</a></li>
                            <li><a className="dropdown-item" href="/logoff">{t('btnLogoff')}</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <EditUserModal 
                isOpen={isEditUserModalOpen}
                onRequestClose={() => setIsEditUserModalOpen(false)}
            />
            <SelectLanguageModal
                isOpen={isLanguageModalOpen}
                onRequestClose={() => setIsLanguageModalOpen(false)}
            />
        </nav>
    );
  }
  
  export default NavbarUser;