import React from 'react';
import PropTypes from 'prop-types';
import './PrimaryButton.css';
import './Button.css';

const PrimaryButton = ({ children, ...props }) => {
  return (
    <button className="button primary_button" {...props}>
      {children}
    </button>
  );
};

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrimaryButton;