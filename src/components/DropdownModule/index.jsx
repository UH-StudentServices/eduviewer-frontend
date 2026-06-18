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
import { number, shape } from 'prop-types';
import classNames from 'classnames';

import { hintType } from '../../types';
import {
  creditsToString,
  getChildRuleOptions,
  getLangAttribute,
  getNameWithLangCode,
  hyphenateText
} from '../../utils';
import OptionContext from '../../context/OptionContext';
import AccordionStateContext from '../../context/AccordionStateContext';
import useTranslation from '../../hooks/useTranslation';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import rootStyles from '../RootModule/rootModule.css';
import styles from './dropdownModule.css';

const DropdownModule = ({ rule, hlevel, hints }) => {
  const { lang } = useContext(OptionContext);
  const { getStudyTrackSelection, setStudyTrackSelection } = useContext(AccordionStateContext);
  const { t } = useTranslation();

  const childRules = rule.dataNode?.rule?.rules ?? [];
  const [name, nameLangCode] = getNameWithLangCode(rule, lang);
  const moduleCredits = creditsToString(rule.dataNode.targetCredits, t, true);
  const nameLang = getLangAttribute(lang, nameLangCode);

  const [selected, setSelected] = useState(() => getStudyTrackSelection(rule.localId) ?? '');
  const selectedRule = childRules.find((r) => r.localId === selected);
  const selectedSubRule = selectedRule?.dataNode?.rule;

  const handleChange = (next = '') => {
    setSelected(next);
    setStudyTrackSelection(rule.localId, next || null);
  };

  const comboboxId = `dropdown-${rule.localId}`;
  const LabelHeading = `h${hlevel}`;
  const titleClassName = classNames(styles.studyTrackTitle, 'ds-heading-2xs');

  return (
    <>
      <div
        className={classNames(
          styles.dropdownContainer,
          { [styles.dropdownContainerSelected]: !!selected }
        )}
      >
        <eduviewer-ds-combobox
          dsId={comboboxId}
          dsValue={selected}
          dsFullWidth
          dsClearable
          ondsChange={(event) => handleChange(event.detail)}
        >
          <LabelHeading slot="label" className={styles.studyTrackLabelHeading}>
            <label lang={nameLang} htmlFor={comboboxId} className={titleClassName}>
              {hyphenateText(name, lang)}
            </label>
            {moduleCredits && <span className={rootStyles.moduleCredits}>{moduleCredits}</span>}
          </LabelHeading>
          {getChildRuleOptions(childRules, lang).map(({ localId, name: childName }) => (
            <eduviewer-ds-option
              key={localId}
              dsId={`dropdown-${rule.localId}-option-${localId}`}
              dsValue={localId}
            >
              {childName}
            </eduviewer-ds-option>
          ))}
        </eduviewer-ds-combobox>
      </div>
      {selectedSubRule && (
        <div className={styles.selectedTrackContent}>
          <Rule
            rule={selectedSubRule}
            hlevel={hlevel + 1}
            parent={{
              ...hints, isAccordion: false, isStudyTrack: false, isInStudyTrack: true
            }}
          />
        </div>
      )}
    </>
  );
};

DropdownModule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  hints: hintType.isRequired
};

export default DropdownModule;
