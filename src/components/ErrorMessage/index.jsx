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
