import React from 'react';

import styles from './loader.css';

const Loader = () => (
  <div className={styles.loader}>
    <span className="icon--spinner icon-spin" />
  </div>
);

export default Loader;
