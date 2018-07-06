import React from 'react';
import { string } from 'prop-types';
import { creditsType, localizedTextType } from '../../types';

import styles from './course.css';

const Course = ({ code, name, credits }) => (
  <li>
    {`${code} ${name.fi} `}
    <span className={styles.credits}>
      ({credits.min === credits.max ? credits.min : `${credits.min}–${credits.max}`} op)
    </span>
  </li>
);

Course.propTypes = {
  code: string.isRequired,
  name: localizedTextType.isRequired,
  credits: creditsType.isRequired
};

export default Course;
