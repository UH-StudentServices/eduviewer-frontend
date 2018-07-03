import React from 'react';
import {
  oneOfType, string, number, bool, func
} from 'prop-types';
import Loader from '../Loader';
import { selectOptionsType } from '../../types';

import styles from './loaderDropdown.css';

const LoadingDropdown = ({ label, text }) => (
  <div className={styles.loaderContainer}>
    <span className={styles.labelText}>{label}</span>
    <div className={styles.loadingContainer}>
      <div className={styles.loadingText}>{text}</div>
      <Loader />
    </div>
  </div>);

LoadingDropdown.propTypes = {
  label: string.isRequired,
  text: string.isRequired
};

const LoadedDropdown = ({
  id, value, onChange, options, label
}) => {
  const hasOptions = options && options.length > 0;
  const optionElements = hasOptions
    ? options.map(o => <option key={o.id} value={o.value}>{o.text}</option>)
    : <option>Ei sisältöä</option>;

  return (
    <label htmlFor={id}>
      {label}
      <select
        className={styles.select}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        disabled={!hasOptions}
      >
        { optionElements }
      </select>
    </label>
  );
};

LoadedDropdown.propTypes = {
  id: string.isRequired,
  value: oneOfType([string, number]),
  onChange: func.isRequired,
  options: selectOptionsType.isRequired,
  label: string.isRequired
};

LoadedDropdown.defaultProps = {
  value: ''
};

const LoaderDropdown = (props) => {
  const { isLoading, value, options } = props;
  const selectedValue = options.find(o => o.value === value);
  const selectedText = selectedValue ? selectedValue.text : '';
  return (
    <div className={styles.dropdownContainer}>
      { isLoading
        ? <LoadingDropdown text={selectedText} {...props} />
        : <LoadedDropdown {...props} />
      }
    </div>
  );
};

LoaderDropdown.propTypes = {
  isLoading: bool.isRequired,
  value: oneOfType([string, number]).isRequired,
  options: selectOptionsType.isRequired
};

export default LoaderDropdown;
