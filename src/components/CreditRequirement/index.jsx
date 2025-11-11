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
import { shape } from 'prop-types';
import styles from '../RootModule/rootModule.css';
import { requiredCoursesToString } from '../../utils';
import useTranslation from '../../hooks/useTranslation';

const CreditRequirement = ({ rule }) => {
  const { t } = useTranslation();
  const { require, allMandatory } = rule;

  const hasRequiredCoursesRange = require && (require.max || require.min > 0);
  if (!allMandatory && hasRequiredCoursesRange) {
    return (<div className={styles.creditRequirement}>{t('select')} {requiredCoursesToString(require)}</div>);
  }
  return null;
};

CreditRequirement.propTypes = {
  rule: shape({}).isRequired
};

export default CreditRequirement;
