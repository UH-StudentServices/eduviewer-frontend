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

import React, { useContext, useState } from 'react';
import {
  bool, number, string
} from 'prop-types';

import { oneOfRulesType } from '../../types';
import { getName } from '../../utils';

import styles from './dropdownModule.css';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import OptionContext from '../../context/OptionContext';
import useTranslation from '../../hooks/useTranslation';

const NOTHING_SELECTED = '-';

const DropdownModule = ({
  rule, hlevel, insideAccordion, noChoiceContentTranslationId
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(NOTHING_SELECTED);
  const { lang, showAll } = useContext(OptionContext);
  const subRules = rule.dataNode.rule.rules;
  const selectedRule = selected !== NOTHING_SELECTED
    && subRules.find((subRule) => subRule.localId === selected);

  if (showAll) {
    return rule.dataNode.rules.map((r) => (
      <Rule
        key={r.localId}
        rule={rule}
        hlevel={hlevel}
      />
    ));
  }
  return (
    <div className={styles.dropdownContainer} key={rule.localId}>
      <label className={styles.label} htmlFor={`select-${rule.localId}`}>{getName(rule, lang)}</label>
      <div className={styles.selectContainer}>
        <select
          value={selected}
          id={`select-${rule.localId}`}
          onChange={(e) => { setSelected(e.target.value); }}
        >
          <option value={NOTHING_SELECTED} aria-label={t('noChoice')}>
            {t(noChoiceContentTranslationId)}
          </option>
          {subRules.map((subRule) => (
            <option key={subRule.localId} value={subRule.localId}>
              {getName(subRule, lang)}
            </option>
          ))}
        </select>
      </div>
      {selectedRule ? (
        <Rule
          rule={selectedRule}
          hlevel={hlevel}
          insideAccordion={insideAccordion}
          atFirstDegreeProgramme
        />
      ) : null}
    </div>
  );
};

DropdownModule.propTypes = {
  rule: oneOfRulesType.isRequired,
  hlevel: number.isRequired,
  insideAccordion: bool.isRequired,
  noChoiceContentTranslationId: string
};

DropdownModule.defaultProps = {
  noChoiceContentTranslationId: undefined
};

export default DropdownModule;
