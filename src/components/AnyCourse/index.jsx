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
import {
  oneOf,
  string
} from 'prop-types';
import classNames from 'classnames';

import ViewportContext from '../../context/ViewportContext';
import styles from '../RootModule/rootModule.css';
import { hintType } from '../../types';
import GroupHeader from '../GroupHeader';
import { ruleTypes } from '../../constants';

const AnyCourse = ({
  hints, type, text, linkText, linkUrl
}) => {
  const { isXSmallOrSmaller } = useContext(ViewportContext);

  const isListItem = (
    hints.hasCourseUnits
    || hints.hasStudyModules
    || hints.parent.hasCourseUnits
    || hints.parent.hasStudyModules
  );

  return (
    <div
      className={
        classNames(
          styles.anyCourse,
          {
            [styles.borderLeft]: hints.isInAccordion,
            [styles.borderTop]: isListItem
          }
        )
      }
    >
      <GroupHeader hints={hints} borderTop borderBottom />
      <div
        className={
            classNames(
              'ds-pr-sm',
              {
                'ds-pl-sm': hints.isInAccordion || isXSmallOrSmaller,
                'ds-py-2xs': isListItem && type === ruleTypes.ANY_COURSE_UNIT_RULE,
                'ds-py-xs': isListItem && type === ruleTypes.ANY_MODULE_RULE,
                'ds-pb-xs ds-pl-sm': !isListItem,
                'ds-pt-xs': !isListItem && !hints.hasTextContent
              }
            )
          }
      >
        <div
          className={
            classNames(
              `ds-bodytext-md ${styles.anyCourseContent}`,
              {
                [styles.anyCourseContentPadded]: !isListItem
              }
            )
          }
        >
          <span>
            {text}{' '}
            <eduviewer-ds-link
              dsHref={linkUrl}
              dsText={linkText}
              dsVariant="inline"
            />
          </span>
        </div>
      </div>
    </div>
  );
};

AnyCourse.propTypes = {
  hints: hintType.isRequired,
  type: oneOf([ruleTypes.ANY_COURSE_UNIT_RULE, ruleTypes.ANY_MODULE_RULE]).isRequired,
  text: string.isRequired,
  linkText: string.isRequired,
  linkUrl: string.isRequired
};

export default AnyCourse;
