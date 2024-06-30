import React from 'react';
import PropTypes from 'prop-types';
import './SecondaryButton.css';
import './Button.css';
import classNames from 'classnames';

const SecondaryButton = ({ children, className, ...props }) => {
  return (
    <button className={classNames('button', 'secondary_button', className)} {...props}>
      {children}
    </button>
  );
};

SecondaryButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SecondaryButton;