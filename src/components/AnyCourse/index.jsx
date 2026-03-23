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
  string
} from 'prop-types';
import classNames from 'classnames';

import ViewportContext from '../../context/ViewportContext';
import styles from '../RootModule/rootModule.css';
import { hintType } from '../../types';
import GroupHeader from '../GroupHeader';

const AnyCourse = ({
  hints, text, linkText, linkUrl
}) => {
  const { isXSmallOrSmaller } = useContext(ViewportContext);

  const isListItem = hints.hasCourseUnits || hints.hasStudyModules;

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
                'ds-py-xs': isListItem,
                'ds-pb-xs ds-pl-sm': !isListItem,
                'ds-pt-xs': !isListItem && !hints.hasTextContent
              }
            )
          }
      >
        <div className={`ds-bodytext-md ${styles.anyCourseContent}`}>
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
  text: string.isRequired,
  linkText: string.isRequired,
  linkUrl: string.isRequired
};

export default AnyCourse;
