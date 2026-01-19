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
import {
  bool, shape, number, string
} from 'prop-types';

import {
  countPotentialAccordions,
  creditsToString,
  getName,
  getSubRules,
  isDegreeProgramme,
  sortAndRenderRules
} from '../../utils';

import DropdownModule from '../DropdownModule'; // eslint-disable-line

import styles from '../RootModule/rootModule.css';
import ModuleTitle from '../ModuleTitle';
import Accordion from '../Accordion';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import {
  FOREIGN_LANGUAGE_DROPDOWN_MODULES,
  STUDY_TRACK_DROPDOWN_MODULES,
  SPECIALISATION_DROPDOWN_MODULES
} from '../../constants';
import OptionContext from '../../context/OptionContext';
import RuleInfo from '../RuleInfo';
import useTranslation from '../../hooks/useTranslation';

const calculateAccordionState = (
  showAll,
  skipTitle,
  atFirstDegreeProgramme,
  name,
  insideAccordion,
  canBeAccordion,
  rule
) => {
  const skipAccordionLogic = showAll || skipTitle || atFirstDegreeProgramme;
  const isForeignLanguage = FOREIGN_LANGUAGE_DROPDOWN_MODULES.includes(name);

  return {
    accordion:
      !skipAccordionLogic
      && (isForeignLanguage || (!insideAccordion && canBeAccordion)),
    internalAccordion: !skipAccordionLogic && isForeignLanguage,
    nextInsideAccordion:
      insideAccordion
      || (!skipAccordionLogic && (isForeignLanguage || canBeAccordion)),
    nextCanBeAccordion:
      !skipAccordionLogic
      && !insideAccordion
      && !isForeignLanguage
      && !canBeAccordion
      && countPotentialAccordions(getSubRules(rule)) > 1
  };
};

const ModuleRule = ({
  skipTitle,
  rule,
  insideAccordion,
  canBeAccordion,
  hlevel,
  closestTitleId,
  atFirstDegreeProgramme
}) => {
  const {
    lang, internalLinks, academicYear, showAll
  } = useContext(OptionContext);
  const { t } = useTranslation();

  if (!rule?.dataNode || typeof rule.dataNode !== 'object') {
    return null;
  }
  const name = getName(rule, lang);
  if (!name) {
    return null;
  }
  const nameLower = name.toLowerCase();

  const shouldRenderDropdown = !showAll
    && (STUDY_TRACK_DROPDOWN_MODULES.includes(nameLower)
      || SPECIALISATION_DROPDOWN_MODULES.includes(nameLower));

  if (shouldRenderDropdown) {
    return (
      <DropdownModule
        rule={rule}
        showAll={showAll}
        hlevel={hlevel}
        insideAccordion={insideAccordion}
        noChoiceContentTranslationId={
          STUDY_TRACK_DROPDOWN_MODULES.includes(nameLower)
            ? 'chooseStudyTrack'
            : 'chooseSpecialisation'
        }
      />
    );
  }

  const {
    nextInsideAccordion,
    accordion,
    internalAccordion,
    nextCanBeAccordion
  } = calculateAccordionState(
    showAll,
    skipTitle,
    atFirstDegreeProgramme,
    name,
    insideAccordion,
    canBeAccordion,
    rule
  );

  const moduleCredits = creditsToString(rule.dataNode.targetCredits, t, true);
  const moduleCode = rule.dataNode.code;
  const showAsLink = rule.dataNode.gradeScaleId || isDegreeProgramme(rule.dataNode);

  const hasTitle = name && !accordion && !skipTitle;
  const newClosestTitleId = hasTitle || accordion ? `title-${rule.localId}` : closestTitleId;
  const renderRule = (r) => (
    <Rule
      key={r.localId}
      rule={r}
      showAll={showAll}
      insideAccordion={nextInsideAccordion}
      hlevel={hasTitle || accordion ? hlevel + 1 : hlevel}
      closestTitleId={newClosestTitleId}
      canBeAccordion={nextCanBeAccordion}
    />
  );

  const [listContent, otherContent] = sortAndRenderRules(
    getSubRules(rule),
    renderRule
  );
  let content = otherContent;

  if (listContent.length) {
    content = [
      // eslint-disable-next-line jsx-a11y/no-redundant-roles
      <ul key={`ul-${rule.localId}`} aria-labelledby={newClosestTitleId}>
        {listContent}
      </ul>,
      ...otherContent
    ];
  }

  content = (
    <>
      <ModuleTitle
        name={name}
        hlevel={hlevel}
        accordion={accordion}
        skipTitle={skipTitle}
        showAsLink={showAsLink}
        moduleCode={moduleCode}
        moduleCredits={moduleCredits}
        rule={rule}
        lang={lang}
        academicYear={academicYear}
        internalLinks={internalLinks}
      />
      <RuleInfo rule={rule} lang={lang} content={content} />
    </>
  );

  if (accordion && name) {
    content = (
      <Accordion
        rule={rule}
        internalAccordion={internalAccordion}
        hlevel={hlevel}
      >
        {content}
      </Accordion>
    );
  }

  return (
    <section id={rule.localId} key={rule.localId} className={styles.module}>
      {content}
    </section>
  );
};

ModuleRule.defaultProps = {
  skipTitle: false,
  insideAccordion: false,
  atFirstDegreeProgramme: false,
  canBeAccordion: false,
  closestTitleId: undefined
};

ModuleRule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  skipTitle: bool,
  insideAccordion: bool,
  atFirstDegreeProgramme: bool,
  closestTitleId: string,
  canBeAccordion: bool
};

export default ModuleRule;
