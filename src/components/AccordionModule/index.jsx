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

import React, { useState } from 'react';
import { bool, func } from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { activeLanguageType, oneOfRulesType } from '../../types';
import GroupingModule from '../GroupingModule'; // eslint-disable-line
import { getName } from '../../utils';
import styles from './accordionModule.css';

const AccordionModule = ({
  showAll, rule, internalAccordion, activeLanguage, translate, startOpen
}) => {
  const [open, setOpen] = useState(startOpen);

  const lang = activeLanguage.code;

  if (showAll && rule.dataNode.rules) {
    return rule.dataNode.rules.map((r) => (
      <GroupingModule
        key={r.localId}
        rule={rule}
        showAll={showAll}
        activeLanguage={activeLanguage}
      />
    ));
  }

  const targetCreditText = () => {
    const { targetCredits } = rule.dataNode;
    if (!targetCredits) {
      return '';
    }

    if (targetCredits.min === targetCredits.max
      || targetCredits.max === null) {
      return `${targetCredits.min} ${translate('creditLabel')}`;
    }
    if (!targetCredits.max) {
      return `${translate('atLeast')} ${targetCredits.min} ${translate('creditLabel')}`;
    }
    return `${targetCredits.min}-${targetCredits.max} ${translate('creditLabel')}`;
  };

  return (
    <div className={`${styles.accordionContainer} ${internalAccordion ? styles.internalAccordionContainer : ''}`}>
      <button
        type="button"
        className="button--action theme-transparent"
        onClick={() => setOpen(!open)}
      >
        <div className={styles.accordionTitle}>
          <span className={styles.normalFontWeight}>{rule.dataNode.code}</span>
          <span className={styles.accordionName}> {getName(rule, lang)}</span>
          <span className={`${styles.caretIcon} ${open ? 'icon--caret-up' : 'icon--caret-down'}`} />
        </div>
        <div className={styles.normalFontWeight}>{targetCreditText()}</div>
      </button>
      {open && rule.dataNode.rule && (
        <GroupingModule
          key={rule.dataNode.rule?.localId}
          rule={rule.dataNode.rule}
          showAll={showAll}
          activeLanguage={activeLanguage}
          level={99}
        />
      )}
    </div>
  );
};

AccordionModule.defaultProps = {
  internalAccordion: false,
  startOpen: false
};

AccordionModule.propTypes = {
  rule: oneOfRulesType.isRequired,
  showAll: bool.isRequired,
  internalAccordion: bool,
  activeLanguage: activeLanguageType.isRequired,
  translate: func.isRequired,
  startOpen: bool
};

export default withLocalize(AccordionModule);
