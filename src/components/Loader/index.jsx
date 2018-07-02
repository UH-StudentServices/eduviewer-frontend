import React from 'react';
import { bool } from 'prop-types';

import styles from './loader.css';

const Loader = ({ isSelect }) => (
  <div className={`${styles.loader} ${isSelect && styles.selectLoader}`}>
    <span className="icon--spinner icon-spin" />
  </div>
);

Loader.propTypes = {
  isSelect: bool
};

Loader.defaultProps = {
  isSelect: false
};

export default Loader;
