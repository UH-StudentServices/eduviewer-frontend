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
import { bool, string } from 'prop-types';
import classNames from 'classnames';

import { getOrdinalString } from '../../utils';
import { hintType } from '../../types';
import styles from '../RootModule/rootModule.css';
import useTranslation from '../../hooks/useTranslation';

const GroupHeader = ({
  id,
  hints,
  borderTop,
  borderBottom,
  borderLeft
}) => {
  const { t } = useTranslation();

  if (!hints.ordinal) {
    return null;
  }

  const ordinalString = getOrdinalString(hints);

  return (
    <div
      id={id}
      className={
        classNames(
          'ds-bodytext-sm',
          styles.groupHeader,
          {
            [styles.borderTop]: borderTop,
            [styles.borderBottom]: borderBottom,
            [styles.borderLeft]: borderLeft
          }
        )
      }
    >
      <eduviewer-ds-visually-hidden dsTag="span">{t('option')} {ordinalString}</eduviewer-ds-visually-hidden>
      <span aria-hidden="true">{ordinalString}</span>
    </div>
  );
};

GroupHeader.propTypes = {
  id: string.isRequired,
  hints: hintType.isRequired,
  borderTop: bool,
  borderBottom: bool,
  borderLeft: bool
};

GroupHeader.defaultProps = {
  borderTop: false,
  borderBottom: false,
  borderLeft: false
};

export default GroupHeader;
