import React from 'react';
import PropTypes from 'prop-types';
import './Logo.css';
import classNames from 'classnames';

const Logo = ({ logoSrc, backgroundSrc, className}) => {
  const defaultLogoSrc = 'images/logo.png';
  const defaultBackgroundSrc = 'images/logo-background.png';

  return (
    <div className={classNames('logo_container', className)}>
      <img 
        src={backgroundSrc || defaultBackgroundSrc} 
        alt="Background" 
        className="logo_background" 
      />
      <img 
        src={logoSrc || defaultLogoSrc} 
        alt="Logo" 
        className="logo" 
      />
    </div>
  );
};

Logo.propTypes = {
  logoSrc: PropTypes.string,
  backgroundSrc: PropTypes.string
};

export default Logo;
