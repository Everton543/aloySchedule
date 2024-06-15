import React from 'react';
import PropTypes from 'prop-types';
import './Logo.css';

const Logo = ({ logoSrc, backgroundSrc }) => {
  const defaultLogoSrc = 'images/logo.png';
  const defaultBackgroundSrc = 'images/logo-background.png';

  return (
    <div className="logo_container">
      <img 
        src={backgroundSrc || defaultBackgroundSrc} 
        alt="Background Image" 
        className="logo_background" 
      />
      <img 
        src={logoSrc || defaultLogoSrc} 
        alt="Logo Image" 
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
