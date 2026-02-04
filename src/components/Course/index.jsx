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
import { string } from 'prop-types';
import classNames from 'classnames';

import { creditsType, hintType, localizedTextType } from '../../types';
import {
  creditsToString,
  getCourseUnitUrl,
  getLangAttribute,
  getLocalizedTextWithLangCode
} from '../../utils';
import styles from '../RootModule/rootModule.css';
import OptionContext from '../../context/OptionContext';
import useTranslation from '../../hooks/useTranslation';
import GroupHeader from '../GroupHeader';
import Link from '../Link';
import { ruleTypes } from '../../constants';

const Course = ({
  id, code, name, credits, hints
}) => {
  const { t } = useTranslation();
  const { lang, academicYear, internalLinks } = useContext(OptionContext);
  const [courseName, courseNameLangCode] = getLocalizedTextWithLangCode(name, lang);
  const myCredits = creditsToString(credits, t, true);

  const hasBorderTop = !(
    hints.parent?.ruleType === ruleTypes.COMPOSITE_RULE
    && hints.index === 0
    && (
      (hints.parent?.ordinal && !hints.parent?.hasDescription)
      || !hints.parent?.hasTextContent
    )
  );

  return (
    <div
      className={
        classNames(
          styles.course,
          styles.borderLeft,
          styles.borderBottom,
          {
            [styles.borderTop]: hasBorderTop
          }
        )
      }
    >
      <GroupHeader hints={hints} borderTop borderBottom />
      <div className="ds-py-xs ds-px-sm">
        <div className={`ds-bodytext-md ${styles.courseContent}`}>
          <span>
            {code}&nbsp;
            <Link
              href={getCourseUnitUrl(id, lang, academicYear)}
              external={!internalLinks}
              lang={getLangAttribute(lang, courseNameLangCode)}
              dsText={courseName}
            />
          </span>
          <small className="ds-bodytext-md">{myCredits}</small>
        </div>
      </div>
    </div>
  );
};

Course.propTypes = {
  id: string.isRequired,
  code: string.isRequired,
  name: localizedTextType.isRequired,
  credits: creditsType.isRequired,
  hints: hintType.isRequired
};

export default Course;
