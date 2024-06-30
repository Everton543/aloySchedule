import React from 'react';
import PropTypes from 'prop-types';
import './PrimaryButton.css';
import './Button.css';
import classNames from 'classnames';

const PrimaryButton = ({ children, className, ...props }) => {
  return (
    <button className={classNames('button', 'primary_button', className)} {...props}>
      {children}
    </button>
  );
};

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrimaryButton;