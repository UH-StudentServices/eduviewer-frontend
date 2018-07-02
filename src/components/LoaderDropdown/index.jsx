import React from 'react';
import {
  oneOfType, string, number, bool, func, shape, arrayOf
} from 'prop-types';
import Loader from '../Loader';

import styles from './loaderDropdown.css';

const LoadingDropdown = ({ label }) => (
  <div className={styles.loaderContainer}>
    <span className={styles.labelText}>{label}</span>
    <Loader isSelect />
  </div>);

LoadingDropdown.propTypes = {
  label: string.isRequired
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
  options: arrayOf(shape({
    id: oneOfType([string, number]).isRequired,
    value: oneOfType([string, number]).isRequired,
    text: string.isRequired
  })).isRequired,
  label: string.isRequired
};

LoadedDropdown.defaultProps = {
  value: ''
};

const LoaderDropdown = (props) => {
  const { isLoading } = props;
  return (
    <div className={styles.dropdownContainer}>
      { isLoading
        ? <LoadingDropdown {...props} />
        : <LoadedDropdown {...props} />
      }
    </div>
  );
};

LoaderDropdown.propTypes = {
  isLoading: bool.isRequired
};

export default LoaderDropdown;
