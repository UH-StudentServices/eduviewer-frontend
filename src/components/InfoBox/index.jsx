import React from 'react';
import { string, bool } from 'prop-types';

import styles from './infoBox.css';

const InfoBox = ({ content, setInnerHtml }) => (
  <div className={styles.infoContainer}>
    <span className={`${styles.iconContainer} icon--info`} />
    {setInnerHtml
      // eslint-disable-next-line react/no-danger
      ? <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
      : <div className={styles.content}>{content}</div>
    }
  </div>
);

InfoBox.propTypes = {
  content: string.isRequired,
  setInnerHtml: bool
};

InfoBox.defaultProps = {
  setInnerHtml: false
};

export default InfoBox;
