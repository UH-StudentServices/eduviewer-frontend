/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-fronted is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-fronted is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-fronted.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import { string } from 'prop-types';

import styles from './errorMessage.css';

const ErrorMessage = ({ errorMessage }) => (
  <div className={`messages error ${styles.errorContainer}`}>
    <span className={`icon--warning ${styles.iconContainer}`} />
    <div className={styles.message}>
      <div className={styles.messageTitle}>Virhe tietojen hakemisessa:</div>
      <div>{errorMessage}</div>
    </div>
  </div>
);

ErrorMessage.propTypes = {
  errorMessage: string.isRequired
};

export default ErrorMessage;
