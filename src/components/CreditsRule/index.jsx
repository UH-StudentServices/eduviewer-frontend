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
import { number, shape } from 'prop-types';
import classNames from 'classnames';

import ViewportContext from '../../context/ViewportContext';
import { hintType } from '../../types';
import { creditsToString } from '../../utils';
import useTranslation from '../../hooks/useTranslation';
import styles from '../RootModule/rootModule.css';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';

const CreditsRule = ({
  rule,
  hlevel,
  hints,
  index
}) => {
  const { isXSmallOrSmaller } = useContext(ViewportContext);
  const { t } = useTranslation();
  const r = rule.rule;
  const tagText = `${t('creditsRule.select')} ${creditsToString(rule.credits, t)}`;
  return (
    <div key={rule.localId}>
      <eduviewer-ds-tag
        className={
          classNames(
            styles.creditsRule,
            'ds-py-sm',
            'ds-pr-sm',
            {
              'ds-pl-sm': hints.isInAccordion || isXSmallOrSmaller,
              [styles.borderLeft]: hints.isInAccordion
            }
          )
        }
        dsText={tagText}
      />
      {r && (
        <Rule
          key={r.localId}
          rule={r}
          hlevel={hlevel}
          parent={hints}
          index={index}
        />
      )}
    </div>
  );
};

CreditsRule.defaultProps = {
  index: 0
};

CreditsRule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  hints: hintType.isRequired,
  index: number
};

export default CreditsRule;
