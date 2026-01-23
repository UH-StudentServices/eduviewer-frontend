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

import React, { useMemo } from 'react';
import { func, shape } from 'prop-types';

import { extrasType, hintsType } from '../../types';
import {
  getRuleHintsByIndex,
  getPreviousCompositeRuleHints,
  getPreviousModuleRuleHints,
  getRules,
  hasCreditRequirement,
  hasCreditsRule,
  hasName,
  isAccordion,
  isDegreeProgramme,
  isStudyModule
} from '../../utils';
import { ruleTypes } from '../../constants';

/**
 * Calculate hints for a rule appending it to the existing hints.
 *
 * @param {*} hints Existing hints array
 * @param {*} rule Rule for which to calculate hints
 * @param {*} ordinal
 * @param {Object} extras Any extra information needed for hint calculation
 * @param {number} extras.index Index of the rule among its siblings
 *
 * @returns Calculated hints array
 */
export const calculateHints = (hints, rule, extras) => {
  const index = extras?.index ?? 0;
  const prevModuleRuleGroup = getPreviousModuleRuleHints(hints, -1);
  const prevCompositeRuleGroup = getPreviousCompositeRuleHints(hints, -1);
  const parentGroup = getRuleHintsByIndex(-1)(hints);
  const hintGroup = new Map();
  const rules = getRules(rule);

  hintGroup.set('ruleType', rule.type ?? '');
  hintGroup.set('rulesCount', rules?.length || 0);
  hintGroup.set('isAccordion', isAccordion(parentGroup, rule));
  hintGroup.set('isInAccordion', parentGroup?.get('isAccordion') || parentGroup?.get('isInAccordion') || false);
  hintGroup.set('isDegreeProgramme', isDegreeProgramme(rule.dataNode));
  hintGroup.set('isStudyModule', isStudyModule(rule.dataNode));
  hintGroup.set('isInStudyModule', parentGroup?.get('isStudyModule') || parentGroup?.get('isInStudyModule') || false);
  hintGroup.set('hasCreditsRule', hasCreditsRule(rule.dataNode));
  hintGroup.set('hasHeading', hintGroup.get('ruleType') === ruleTypes.MODULE_RULE && hasName(rule.dataNode) && !hintGroup.get('isAccordion'));
  hintGroup.set('hasDescription', !!rule.description);
  hintGroup.set('hasStudyModules', rules?.some((r) => isStudyModule(r.dataNode)));
  hintGroup.set('hasCourseUnits', rules?.some((r) => r.type === ruleTypes.COURSE_UNIT_RULE));
  hintGroup.set('hasCourseUnitHeader', parentGroup?.get('hasCourseUnitHeader') || hintGroup.get('hasCourseUnits'));
  hintGroup.set('hasStudyModuleHeader', parentGroup?.get('hasStudyModuleHeader') || hintGroup.get('hasStudyModules'));

  if (rule.require?.min && rules?.length > 1) {
    hintGroup.set('requireMin', rule.require.min);
  }
  if (parentGroup?.get('requireMin') > 0 && parentGroup?.get('rulesCount') > 1 && parentGroup?.get('requireMin') !== parentGroup?.get('rulesCount')) {
    hintGroup.set('ordinal', index + 1);
  }
  if (parentGroup?.get('ruleType') === ruleTypes.COMPOSITE_RULE) {
    hintGroup.set('index', index);
  }

  hintGroup.set('hasTextContent', !!(
    hintGroup.get('ruleType') === ruleTypes.COMPOSITE_RULE && (
      hasCreditRequirement(rule)
      || (hintGroup?.get('hasCourseUnits') && hintGroup?.get('isInStudyModule') && !parentGroup?.get('hasCourseUnitHeader'))
      || (hintGroup.get('hasStudyModules') && !parentGroup?.get('hasStudyModuleHeader'))
      || !!rule.description
      || prevModuleRuleGroup?.get('hasCreditsRule')
    )
  ));

  if (prevModuleRuleGroup) {
    hintGroup.set('prevModuleRule', new Map(prevModuleRuleGroup));
    // Remove to avoid bloating the hints
    hintGroup.get('prevModuleRule').delete('prevModuleRule');
  }

  hintGroup.set('hideAccordionTopBorder', (
    !hintGroup?.get('hasTextContent')
      && !prevModuleRuleGroup?.get('hasCreditsRule')
      && !prevModuleRuleGroup?.get('hasTextContent')
      && !prevModuleRuleGroup?.get('hasHeading')
      && !prevCompositeRuleGroup?.get('hasDescription')
      && !prevCompositeRuleGroup?.get('hasTextContent')
      && hintGroup?.get('index') === 0
      && !hintGroup.has('ordinal')
  ));

  const newHint = [...hints, hintGroup];
  return newHint;
};

const WithHints = ({
  hints,
  rule,
  extras,
  children
}) => {
  const newHints = useMemo(() => calculateHints(hints, rule, extras), [hints, rule, extras]);
  return <>{children(newHints)}</>;
};

WithHints.defaultProps = {
  extras: {
    index: 0
  }
};

WithHints.propTypes = {
  hints: hintsType.isRequired,
  rule: shape({}).isRequired,
  extras: extrasType,
  children: func.isRequired
};

export default WithHints;
