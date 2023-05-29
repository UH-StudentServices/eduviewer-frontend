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
import { func, string, bool } from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { activeLanguageType, creditsType, localizedTextType } from '../../types';
import { creditsToString, getLocalizedText, getStudiesCourseUnitPageUrl } from '../../utils';

import Link from './Link';
import styles from './course.css';

const Course = ({
  id, code, name, credits, activeLanguage, internalLink, translate
}) => (
  <li className={styles.courseItem}>
    <Link external={!internalLink} href={getStudiesCourseUnitPageUrl(id)}>{`${code} ${getLocalizedText(name, activeLanguage.code)} `}</Link>
    <span className={styles.credits}>
      {creditsToString(credits, translate)}
    </span>
  </li>
);

Course.defaultProps = {
  internalLink: false
};

Course.propTypes = {
  id: string.isRequired,
  code: string.isRequired,
  name: localizedTextType.isRequired,
  credits: creditsType.isRequired,
  activeLanguage: activeLanguageType.isRequired,
  internalLink: bool,
  translate: func.isRequired
};

export default withLocalize(Course);
