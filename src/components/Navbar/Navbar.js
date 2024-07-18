import React, { useState, useEffect } from 'react';
import Logo from '../Logo/Logo';
import PrimaryButton from '../Button/PrimaryButton';
import styles from './NavbarClient.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import SelectLanguageModal from '../Modals/SelectLanguageModal';

function Navbar({ clientLink}) {
  const { t, i18n} = useTranslation();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleOpenLanguageModalClick = () => {
      setIsLanguageModalOpen(true);
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const lang = searchParams.get('lang');
    if (lang && i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }
  }, [i18n]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
          <a className="navbar-brand" href={'/'+clientLink}>
              <Logo className={styles.menuLogo}></Logo>
          </a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className={classNames("nav-item", styles.menuItems)}>
                  <PrimaryButton className="nav-link"><a href='/login'>{t('btnLogin')}</a></PrimaryButton>
              </li>
              <li className={classNames("nav-item", styles.menuItems)}><PrimaryButton className="nav-link"><a href="#" onClick={handleOpenLanguageModalClick}>{t('btnChooseLanguage')}</a></PrimaryButton></li>
          </ul>
      </div>
      <SelectLanguageModal
          isOpen={isLanguageModalOpen}
          onRequestClose={() => setIsLanguageModalOpen(false)}
      />
  </nav>
  );
}

export default Navbar;