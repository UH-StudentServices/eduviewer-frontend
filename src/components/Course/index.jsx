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
import { withLocalize } from 'react-localize-redux';
import { activeLanguageType, creditsType, localizedTextType } from '../../types';
import { creditsToString, getLocalizedText } from '../../utils';

import styles from './course.css';

const Course = ({
  code, name, credits, activeLanguage
}) => (
  <li>
    {`${code} ${getLocalizedText(name, activeLanguage.code)} `}
    <span className={styles.credits}>
      ({creditsToString(credits, activeLanguage.code)})
    </span>
  </li>
);

Course.propTypes = {
  code: string.isRequired,
  name: localizedTextType.isRequired,
  credits: creditsType.isRequired,
  activeLanguage: activeLanguageType.isRequired
};

export default withLocalize(Course);
