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
import {
  arrayOf,
  node,
  oneOfType,
  string
} from 'prop-types';
import classNames from 'classnames';

import styles from '../RootModule/rootModule.css';
import { hintsType } from '../../types';
import { getParentRuleHints } from '../../utils';

const AnyCourse = ({ hints, children }) => {
  const parentHints = getParentRuleHints(hints);
  return (
    <div
      className={
        classNames(
          styles.anyCourse,
          'ds-px-sm',
          {
            [`${styles.borderTop} ${styles.borderLeft} ds-py-xs`]: parentHints?.get('hasCourseUnits'),
            [`${styles.borderLeft} ds-pb-xs`]: !parentHints?.get('hasCourseUnits'),
            'ds-pt-xs': !parentHints?.get('hasCourseUnits') && !parentHints?.get('hasTextContent')
          }
        )
      }
    >
      <div className={`ds-bodytext-md ${styles.anyCourseContent}`}>
        {children}
      </div>
    </div>
  );
};

AnyCourse.defaultProps = {
  hints: []
};

AnyCourse.propTypes = {
  hints: hintsType,
  children: oneOfType([node, arrayOf(node), string]).isRequired
};

export default AnyCourse;
