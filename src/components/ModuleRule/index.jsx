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
  func, bool, shape, number, string
} from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import {
  ariaLabelForTitle, countPotentialAccordions,
  creditsToString, getDegreeProgrammeUrl,
  getName, getStudyModuleUrl, getSubRules, isDegreeProgramme,
  sortAndRenderRules
} from '../../utils';

import DropdownModule from '../DropdownModule'; // eslint-disable-line

import styles from '../RootModule/rootModule.css';
import Heading from '../Heading';
import Link from '../Link';
import Accordion from '../Accordion';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import { FOREIGN_LANGUAGE_DROPDOWN_MODULES, STUDY_TRACK_DROPDOWN_MODULES, SPECIALISATION_DROPDOWN_MODULES } from '../../constants';
import OptionContext from '../../context/OptionContext';
import RuleInfo from '../RuleInfo';

const ModuleRule = ({
  translate: t,
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
  if (!rule) {
    return null;
  }
  const name = getName(rule, lang);
  const nameLower = name.toLowerCase();

  const shouldRenderDropdown = !showAll
    && (
      STUDY_TRACK_DROPDOWN_MODULES.includes(nameLower)
      || SPECIALISATION_DROPDOWN_MODULES.includes(nameLower)
    );

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

  let nextInsideAccordion = insideAccordion;
  let accordion = false;
  let internalAccordion = false;
  let nextCanBeAccordion = false;
  if (showAll || skipTitle || atFirstDegreeProgramme) {
    accordion = false;
  } else if (FOREIGN_LANGUAGE_DROPDOWN_MODULES.includes(nameLower)) {
    accordion = true;
    internalAccordion = true;
    nextInsideAccordion = true;
  } else if (!insideAccordion && canBeAccordion) {
    accordion = true;
    nextInsideAccordion = true;
  } else if (!insideAccordion) {
    nextCanBeAccordion = countPotentialAccordions(getSubRules(rule)) > 1;
  }

  const moduleCredits = creditsToString(rule.dataNode.targetCredits, t, true);
  const moduleCode = rule.dataNode.code;
  const showAsLink = rule.dataNode.gradeScaleId || isDegreeProgramme(rule.dataNode);
  let moduleTitle = '';
  if (name && !accordion && !skipTitle) {
    if (showAsLink) {
      moduleTitle = (
        <Heading
          level={hlevel}
          className={styles.moduleTitle}
          id={`title-${rule.localId}`}
        >
          <Link
            href={isDegreeProgramme(rule.dataNode)
              ? getDegreeProgrammeUrl(rule.dataNode.id, lang, academicYear)
              : getStudyModuleUrl(rule.dataNode.id, lang, academicYear)}
            ariaLabel={ariaLabelForTitle(moduleCode, name, moduleCredits)}
            external={!internalLinks}
          >
            <span aria-hidden>{moduleCode} </span>
            {name}
          </Link>
          {moduleCredits
            && <span className={styles.moduleCredits} aria-hidden>{moduleCredits}</span>}
        </Heading>
      );
    } else {
      moduleTitle = (
        <Heading
          level={hlevel}
          className={styles.moduleTitle}
          id={`title-${rule.localId}`}
          ariaLabel={ariaLabelForTitle(undefined, name, moduleCredits)}
        >
          {name}
          {moduleCredits
            && <span className={styles.moduleCredits} aria-hidden>{moduleCredits}</span>}
        </Heading>
      );
    }
  }

  const newClosestTitleId = (moduleTitle || accordion) ? `title-${rule.localId}` : closestTitleId;
  const renderRule = (r) => (
    <Rule
      key={r.localId}
      rule={r}
      showAll={showAll}
      translate={t}
      insideAccordion={nextInsideAccordion}
      hlevel={moduleTitle || accordion ? hlevel + 1 : hlevel}
      closestTitleId={newClosestTitleId}
      canBeAccordion={nextCanBeAccordion}
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
  skipTitle: false,
  insideAccordion: false,
  atFirstDegreeProgramme: false,
  canBeAccordion: false,
  closestTitleId: undefined
};

ModuleRule.propTypes = {
  rule: shape({}).isRequired,
  translate: func.isRequired,
  hlevel: number.isRequired,
  skipTitle: bool,
  insideAccordion: bool,
  atFirstDegreeProgramme: bool,
  closestTitleId: string,
  canBeAccordion: bool
};

export default withLocalize(ModuleRule);
