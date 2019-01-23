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
import { string } from 'prop-types';
import { Translate } from 'react-localize-redux';

import styles from './errorMessage.css';

const ErrorMessage = ({ errorMessage }) => (
  <div className={`messages error ${styles.errorContainer}`}>
    <span className={`icon--warning ${styles.iconContainer}`} />
    <div className={styles.message}>
      <div className={styles.messageTitle}><Translate id="dataFetchError" />:</div>
      <div>{errorMessage}</div>
    </div>
  </div>
);

ErrorMessage.propTypes = {
  errorMessage: string.isRequired
};

export default ErrorMessage;
