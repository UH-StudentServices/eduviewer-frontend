import React from 'react';
import { string } from 'prop-types';
import { creditsType, localizedTextType } from '../../types';
import { creditsToString } from '../../utils';

import styles from './course.css';

const Course = ({ code, name, credits }) => (
  <li>
    {`${code} ${name.fi} `}
    <span className={styles.credits}>
      ({creditsToString(credits)})
    </span>
  </li>
);

Course.propTypes = {
  code: string.isRequired,
  name: localizedTextType.isRequired,
  credits: creditsType.isRequired
};

export default Course;
