import React from 'react';
import Toggle from 'react-toggle';
import { func, bool, string } from 'prop-types';

import styles from './toggleSelect.css';

const TOGGLE_ID = 'toggle';

const ToggleSelect = ({ onChange, label, checked }) => (
  <div className={styles.toggleContainer}>
    <label htmlFor={TOGGLE_ID} className={styles.toggle}>
      <Toggle
        id={TOGGLE_ID}
        defaultChecked={checked}
        onChange={onChange}
      />
      <span className={styles.toggleLabelText}>{label}</span>
    </label>
  </div>
);

ToggleSelect.propTypes = {
  onChange: func.isRequired,
  checked: bool.isRequired,
  label: string.isRequired
};

export default ToggleSelect;
