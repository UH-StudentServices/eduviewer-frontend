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
import React, { useCallback } from 'react';
import { shape, string } from 'prop-types';

import styles from '../RootModule/rootModule.css';
import {
  getOrdinalRangeString,
  getRules,
  hasCreditRequirement,
  isInRange,
  requiredCoursesToString
} from '../../utils';
import useTranslation from '../../hooks/useTranslation';
import { hintType } from '../../types';

const CreditRequirement = ({ id, rule, hints }) => {
  const { t, lang } = useTranslation();
  const rules = getRules(rule);

  const getRangeString = useCallback(() => {
    if (!rule) return '';
    const requiredCoursesString = requiredCoursesToString(rule.require);
    const requiredCoursesNumber = Number(requiredCoursesString);
    if (!Number.isNaN(requiredCoursesNumber) && isInRange(requiredCoursesNumber, 1, 9)) {
      return t(`number.${requiredCoursesNumber}`);
    }
    return requiredCoursesString;
  }, [rule, t]);

  const getTextParts = useCallback(() => {
    switch (lang) {
      case 'fi':
        return [
          t('creditRequirement.select'),
          getRangeString(),
          t('creditRequirement.options'),
          getOrdinalRangeString(hints, rules.length),
          t('creditRequirement.between')
        ];
      case 'sv':
      case 'en':
      default:
        return [
          t('creditRequirement.select'),
          getRangeString(),
          t('creditRequirement.options'),
          t('creditRequirement.between'),
          getOrdinalRangeString(hints, rules.length)
        ];
    }
  }, [lang]);

  if (!hasCreditRequirement(rule)) {
    return null;
  }

  return (
    <div id={id} className={`ds-bodytext-md ds-px-sm ${styles.creditRequirement} ${styles.semibold}`}>
      {getTextParts().filter(Boolean).join(' ')}:
    </div>
  );
};

CreditRequirement.propTypes = {
  id: string.isRequired,
  rule: shape({}).isRequired,
  hints: hintType.isRequired
};

export default CreditRequirement;
