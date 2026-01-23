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
import { number, shape } from 'prop-types';

import { extrasType, hintsType } from '../../types';
import WithHints from '../Rule/WithHints';
import { creditsToString } from '../../utils';
import useTranslation from '../../hooks/useTranslation';
import styles from '../RootModule/rootModule.css';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';

const CreditsRule = ({
  rule,
  hlevel,
  hints,
  extras
}) => {
  const { t } = useTranslation();
  const r = rule.rule;
  const tagText = `${t('creditsRule.select')} ${creditsToString(rule.credits, t)}`;

  return (
    <div key={rule.localId}>
      <eduviewer-ds-tag className={`${styles.creditsRule} ${styles.borderLeft} ds-py-sm ds-px-sm`} dsText={tagText} />
      {r && (
        <WithHints hints={hints} rule={rule} extras={extras}>
          {(newHints) => (
            <Rule
              key={r.localId}
              rule={r}
              hlevel={hlevel}
              hints={newHints}
              extras={extras}
            />
          )}
        </WithHints>
      )}
    </div>
  );
};

CreditsRule.defaultProps = {
  extras: {
    index: 0
  }
};

CreditsRule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  hints: hintsType.isRequired,
  extras: extrasType
};

export default CreditsRule;
