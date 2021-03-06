/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-frontend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-frontend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-frontend.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { Translate, withLocalize } from 'react-localize-redux';
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
  </div>
);

LoadingDropdown.propTypes = {
  label: string.isRequired,
  text: string.isRequired
};

const LoadedDropdown = ({
  id, value, onChange, options, label, translate
}) => {
  const hasOptions = options && options.length > 0;
  const optionElements = hasOptions
    ? options.map((o) => <option key={o.id} value={o.value}>{o.text}</option>)
    : <option label={translate('noContent')}><Translate id="noContent" /></option>;

  return (
    <label htmlFor={id}>
      {label}
      <select
        className={styles.loadedSelect}
        name={id}
        id={id}
        value={value || ''}
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
  label: string.isRequired,
  translate: func.isRequired
};

LoadedDropdown.defaultProps = {
  value: ''
};

const LoaderDropdown = (props) => {
  const {
    isLoading, value, options, translate
  } = props;
  const selectedValue = options.find((o) => o.value === value);
  const selectedText = selectedValue ? selectedValue.text : '';
  return (
    <div>
      {
        isLoading
          ? (
            <>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <LoadingDropdown text={selectedText} translate={translate} {...props} />
            </>
          )
          : (
            <>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <LoadedDropdown translate={translate} {...props} />
            </>
          )
      }
    </div>
  );
};

LoaderDropdown.propTypes = {
  isLoading: bool.isRequired,
  value: oneOfType([string, number]),
  options: selectOptionsType.isRequired,
  translate: func.isRequired
};

LoaderDropdown.defaultProps = {
  value: ''
};

export default withLocalize(LoaderDropdown);
