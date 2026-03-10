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

import React, {
  useContext,
  useRef
} from 'react';
import { number, shape } from 'prop-types';
import classNames from 'classnames';

import ViewportContext from '../../context/ViewportContext';
import { hintType } from '../../types';
import { creditsToString } from '../../utils';
import useTranslation from '../../hooks/useTranslation';
import styles from '../RootModule/rootModule.css';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import useWebComponentClassName from '../../hooks/useWebComponentClassName';

const CreditsRule = ({
  rule,
  hlevel,
  hints,
  index
}) => {
  const dsTagRef = useRef(null);
  const { isXSmallOrSmaller } = useContext(ViewportContext);
  const { t } = useTranslation();

  /**
   * DS adds some classes to the component after mounting,
   * so we need to apply our conditionally set classes together with those.
   *
   * @see {@link https://jira.it.helsinki.fi/browse/EDVWR-214}
   */
  const tagClassName = useWebComponentClassName(
    dsTagRef,
    classNames(
      styles.creditsRule,
      'ds-py-sm',
      'ds-pr-sm',
      {
        'ds-pl-sm': hints.isInAccordion || isXSmallOrSmaller,
        [styles.borderLeft]: hints.isInAccordion
      }
    )
  );

  const r = rule.rule;
  const tagText = `${t('creditsRule.select')} ${creditsToString(rule.credits, t)}`;
  return (
    <div>
      <eduviewer-ds-tag
        ref={dsTagRef}
        className={tagClassName}
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
