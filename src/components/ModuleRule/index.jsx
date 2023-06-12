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
  func, bool, shape, number, string
} from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import {
  ariaLabelForTitle,
  creditsToString,
  getDescription,
  getName,
  renderRequiredCourseAmount,
  sortAndRenderRules
} from '../../utils';

import DropdownModule from '../DropdownModule'; // eslint-disable-line

import styles from '../RootModule/rootModule.css';
import { activeLanguageType } from '../../types';
import Heading from '../Heading';
import Accordion from '../Accordion';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import { FOREIGN_LANGUAGE_DROPDOWN_MODULES, STUDY_TRACK_DROPDOWN_MODULES } from '../../constants';

const getSubRules = (rule) => {
  const { dataNode } = rule;
  if (dataNode?.rules && dataNode.rules.length) {
    return dataNode.rules;
  }
  return dataNode?.rule ? [dataNode.rule] : [];
};

const ModuleRule = ({
  showAll,
  translate: t,
  activeLanguage,
  skipTitle,
  internalLinks,
  rule,
  insideAccordion,
  hlevel,
  closestTitleId,
  isDegreeProgramme
}) => {
  if (!rule) {
    return null;
  }
  const lang = activeLanguage.code;
  const name = getName(rule, lang);
  const shouldRenderDropdown = STUDY_TRACK_DROPDOWN_MODULES.includes(name.toLowerCase());

  if (shouldRenderDropdown && !showAll) {
    return (
      <DropdownModule
        rule={rule}
        showAll={showAll}
        hlevel={hlevel}
        insideAccordion={insideAccordion}
      />
    );
  }

  let nextInsideAccordion = insideAccordion;
  let accordion = false;
  let internalAccordion = false;
  if (showAll || skipTitle || isDegreeProgramme) {
    accordion = false;
  } else if (FOREIGN_LANGUAGE_DROPDOWN_MODULES.includes(name.toLowerCase())) {
    accordion = true;
    internalAccordion = true;
    nextInsideAccordion = true;
  } else if (!insideAccordion) {
    accordion = true;
    nextInsideAccordion = true;
  }

  const moduleCredits = creditsToString(rule.dataNode.targetCredits, t, true);
  const moduleCode = rule.dataNode.code;
  const moduleTitle = name && !accordion && !skipTitle
    && (
      <Heading
        level={hlevel}
        className={styles.moduleTitle}
        id={`title-${rule.localId}`}
        ariaLabel={ariaLabelForTitle(moduleCode, name, moduleCredits)}
      >
        {moduleCode && <span aria-hidden>{moduleCode} </span>}
        {name}
        {moduleCredits && <span className={styles.moduleCredits} aria-hidden>{moduleCredits}</span>}
      </Heading>
    );
  const newClosestTitleId = (moduleTitle || accordion) ? `title-${rule.localId}` : closestTitleId;
  const renderRule = (r) => (
    <Rule
      key={r.localId}
      rule={r}
      showAll={showAll}
      translate={t}
      activeLanguage={activeLanguage}
      internalLinks={internalLinks}
      insideAccordion={nextInsideAccordion}
      hlevel={moduleTitle || accordion ? hlevel + 1 : hlevel}
      closestTitleId={newClosestTitleId}
    />
  );

  const [listContent, otherContent] = sortAndRenderRules(getSubRules(rule), renderRule);
  let content = otherContent;

  if (listContent.length) {
    content = [(
      // eslint-disable-next-line jsx-a11y/no-redundant-roles
      <ul
        key={`ul-${rule.localId}`}
        aria-labelledby={newClosestTitleId}
        role="list"
      >
        {listContent}
      </ul>
    ), ...otherContent];
  }

  content = (
    <>
      {moduleTitle}
      {renderRequiredCourseAmount(rule, t)}
      {getDescription(rule, lang)}
      {content}
    </>
  );

  if (accordion && name) {
    content = (
      <Accordion rule={rule} internalAccordion={internalAccordion} hlevel={hlevel}>
        {content}
      </Accordion>
    );
  }

  return (
    <section
      id={rule.localId}
      key={rule.localId}
      className={styles.module}
    >
      {content}
    </section>
  );
};

ModuleRule.defaultProps = {
  internalLinks: false,
  skipTitle: false,
  insideAccordion: false,
  isDegreeProgramme: false,
  closestTitleId: undefined
};

ModuleRule.propTypes = {
  showAll: bool.isRequired,
  rule: shape({}).isRequired,
  translate: func.isRequired,
  activeLanguage: activeLanguageType.isRequired,
  hlevel: number.isRequired,
  skipTitle: bool,
  internalLinks: bool,
  insideAccordion: bool,
  isDegreeProgramme: bool,
  closestTitleId: string
};

export default withLocalize(ModuleRule);
