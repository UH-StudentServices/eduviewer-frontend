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
  bool, shape, number
} from 'prop-types';

import {
  creditsToString,
  getNameWithLangCode, hasGradeScaleId,
  sortAndPartitionRules
} from '../../utils';

import Accordion from '../Accordion';
// eslint-disable-next-line import/no-cycle
import RuleItem from '../RuleItem';
import {
  STUDY_TRACK_DROPDOWN_MODULES,
  SPECIALISATION_DROPDOWN_MODULES
  // NOTE: This is required for rendering a <DropdownModule /> in the future
  // FOREIGN_LANGUAGE_DROPDOWN_MODULES
} from '../../constants';
import OptionContext from '../../context/OptionContext';
import useTranslation from '../../hooks/useTranslation';
import GroupHeader from '../GroupHeader';
import { hintType } from '../../types';
import ModuleTitle from '../ModuleTitle';

const ModuleRule = ({
  skipTitle,
  rule,
  hlevel,
  hints
}) => {
  const {
    lang, internalLinks, academicYear, showAll
  } = useContext(OptionContext);
  const { t } = useTranslation();

  if (!rule?.dataNode || typeof rule.dataNode !== 'object') {
    return null;
  }
  const [name, nameLangCode] = getNameWithLangCode(rule, lang);
  if (!name) {
    return null;
  }

  const nameLower = name.toLowerCase();
  const shouldRenderDropdown = !showAll
    && (
      STUDY_TRACK_DROPDOWN_MODULES.includes(nameLower)
      || SPECIALISATION_DROPDOWN_MODULES.includes(nameLower)
    );
  if (shouldRenderDropdown) {
    // TODO: Re-introduce <DropdownModule /> when its new design
    // is ready and approved by the PO.
  }

  const moduleCredits = creditsToString(rule.dataNode.targetCredits, t, true);
  const moduleCode = rule.dataNode.code;
  const showAsLink = hasGradeScaleId(rule.dataNode) || hints.isDegreeProgramme;

  const hasTitle = name && !hints.isAccordion && !skipTitle;
  const childHlevel = hasTitle || hints.isAccordion ? hlevel + 1 : hlevel;
  const [listItems, otherItems] = sortAndPartitionRules(rule);
  const renderItem = (item) => (
    <RuleItem
      key={item.rule.localId}
      rule={item.rule}
      hlevel={childHlevel}
      parent={hints}
      index={item.index}
      isListItem={item.isListItem}
    />
  );
  const [listContent, otherContent] = [listItems.map(renderItem), otherItems.map(renderItem)];
  let content = otherContent;

  if (listContent.length) {
    content = [(
      <ul
        key={`ul-${rule.localId}`}
        // TODO: aria-labelledby/-describedby is commented out as `closestTitleId` logic
        // was deprecated after UI rework. This will get fixed as part of the a11y review.
        // aria-labelledby={/* TODO */}
      >
        {listContent}
      </ul>
    ), ...otherContent];
  }

  if (hints.isAccordion) {
    content = (
      <Accordion
        rule={rule}
        hlevel={hlevel}
        isCompact={hints.isInAccordion}
        hints={hints}
      >
        {content}
      </Accordion>
    );
  } else if (name && !skipTitle) {
    content = (
      <>
        <ModuleTitle
          hints={hints}
          name={name}
          nameLangCode={nameLangCode}
          hlevel={hlevel}
          showAsLink={showAsLink}
          moduleCode={moduleCode}
          moduleCredits={moduleCredits}
          rule={rule}
          lang={lang}
          academicYear={academicYear}
          internalLinks={internalLinks}
        />
        {content}
      </>
    );
  }

  return (
    <section
      id={rule.localId}
      key={rule.localId}
    >
      <GroupHeader hints={hints} borderTop borderLeft />
      {content}
    </section>
  );
};

ModuleRule.defaultProps = {
  skipTitle: false
};

ModuleRule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  skipTitle: bool,
  hints: hintType.isRequired
};

export default ModuleRule;
