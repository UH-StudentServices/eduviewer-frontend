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

import React, { useContext } from 'react';
import { func, string } from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { creditsType, localizedTextType } from '../../types';
import { creditsToString, getCourseUnitUrl, getLocalizedText } from '../../utils';

import Link from '../Link';
import styles from '../RootModule/rootModule.css';
import OptionContext from '../../context/OptionContext';

const Course = ({
  id, code, name, credits, translate
}) => {
  const { lang, academicYear, internalLinks } = useContext(OptionContext);
  const title = getLocalizedText(name, lang);
  const myCredits = creditsToString(credits, translate);
  return (
    <li className={styles.courseItem}>
      <Link
        external={!internalLinks}
        href={getCourseUnitUrl(id, lang, academicYear)}
      >
        {code} {title}
        <span className={styles.credits}>{myCredits}</span>
      </Link>
    </li>
  );
};

Course.propTypes = {
  id: string.isRequired,
  code: string.isRequired,
  name: localizedTextType.isRequired,
  credits: creditsType.isRequired,
  translate: func.isRequired
};

export default withLocalize(Course);
