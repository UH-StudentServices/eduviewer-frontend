import React from 'react';
import { string } from 'prop-types';
import { creditsType } from '../../types';

const Course = ({ code, name, credits }) => (
  <li>
    {`${code} ${name.fi} `}
    <strong>
      ({credits.min === credits.max ? credits.min : `${credits.min}–${credits.max}`} op)
    </strong>
  </li>
);

Course.propTypes = {
  code: string.isRequired,
  name: string.isRequired,
  credits: creditsType.isRequired
};

export default Course;
