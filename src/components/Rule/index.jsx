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
import {
  shape, number
} from 'prop-types';

import { ruleTypes } from '../../constants';
import Course from '../Course';
// eslint-disable-next-line import/no-cycle
import ModuleRule from '../ModuleRule';
import CompositeRule from '../CompositeRule';
// eslint-disable-next-line import/no-cycle
import CreditsRule from '../CreditsRule';
import useTranslation from '../../hooks/useTranslation';
import AnyCourse from '../AnyCourse';
import {
  getRules, hasCreditRequirement, hasCreditsRule,
  isAccordion, isDegreeProgramme, isStudyModule
} from '../../utils';
import { hintType } from '../../types';

const INTERESTING_RULES = new Set([
  ruleTypes.COMPOSITE_RULE,
  ruleTypes.MODULE_RULE,
  ruleTypes.COURSE_UNIT_RULE
]);

export const getHints = (parent, rule, index = 0) => {
  const rules = getRules(rule);
  const hints = {
    parent,
    index: parent?.ruleType === ruleTypes.COMPOSITE_RULE ? index : undefined,
    ruleType: rule.type ?? '',
    rulesCount: rules.length || 0,
    closestModule: parent?.ruleType === ruleTypes.MODULE_RULE ? parent : parent?.closestModule,
    closestCompositeRule:
      parent?.ruleType === ruleTypes.COMPOSITE_RULE ? parent : parent?.closestCompositeRule,
    isAccordion: isAccordion(parent, rule),
    isInAccordion: parent?.isAccordion || parent?.isInAccordion || false,
    isDegreeProgramme: isDegreeProgramme(rule.dataNode),
    isStudyModule: isStudyModule(rule.dataNode),
    isInStudyModule: parent?.isStudyModule || parent?.isInStudyModule || false,
    hasCreditsRule: hasCreditsRule(rule.dataNode),
    hasDescription: !!rule.description,
    hasStudyModules: rules?.some((r) => isStudyModule(r.dataNode)),
    hasCourseUnits: rules?.some((r) => r.type === ruleTypes.COURSE_UNIT_RULE),
    requireMin: (hasCreditRequirement(rule) && rules.length > 1) ? rule.require.min : undefined,
    ordinal:
      (parent?.requireMin != null && parent.rulesCount > 1
        && parent.requireMin !== parent.rulesCount) ? index + 1 : undefined
  };
  hints.hasHeading = rule.type === ruleTypes.MODULE_RULE
    && !!rule.dataNode?.name && !hints.isAccordion;
  hints.hasCourseUnitHeader = parent?.hasCourseUnitHeader || hints.hasCourseUnits;
  hints.hasStudyModuleHeader = parent?.hasStudyModuleHeader || hints.hasStudyModules;
  hints.hasTextContent = !!(rule.type === ruleTypes.COMPOSITE_RULE && (
    hasCreditRequirement(rule)
    || (hints.hasCourseUnits && hints.isInStudyModule && !parent?.hasCourseUnitHeader)
    || (hints.hasStudyModules && !parent?.hasStudyModuleHeader)
    || hints.hasDescription
    || hints.closestModule?.hasCreditsRule
  ));
  return hints;
};

const Rule = ({
  rule,
  hlevel,
  parent,
  index
}) => {
  const { t } = useTranslation();

  // No need to calculate new hints for some of the leaf nodes
  const hints = useMemo(() => (rule && (INTERESTING_RULES.has(rule.type)
    || (rule.type === ruleTypes.CREDITS_RULE && rule.rule))
    ? getHints(parent, rule, index) : parent), [parent, rule, index]);

  if (!rule) {
    return null;
  }

  switch (rule.type) {
    case ruleTypes.COMPOSITE_RULE:
      return (
        <CompositeRule
          key={rule.localId}
          rule={rule}
          hlevel={hlevel}
          hints={hints}
        />
      );
    case ruleTypes.MODULE_RULE:
      return (
        <ModuleRule
          key={rule.localId}
          rule={rule}
          hlevel={hlevel}
          hints={hints}
        />
      );
    case ruleTypes.ANY_COURSE_UNIT_RULE:
      return (
        <AnyCourse hints={hints} key={rule.localId}>{t('anyCourseUnit')}</AnyCourse>
      );
    case ruleTypes.ANY_MODULE_RULE:
      return (
        <AnyCourse hints={hints} key={rule.localId}>{t('anyModule')}</AnyCourse>
      );
    case ruleTypes.COURSE_UNIT_RULE: {
      const {
        id, code, name, credits
      } = rule.dataNode;
      const isValidCourse = code && name && credits;

      if (!isValidCourse) {
        return null;
      }

      return (
        <Course
          key={rule.localId}
          id={id}
          code={code}
          name={name}
          credits={credits}
          hints={hints}
        />
      );
    }
    case ruleTypes.CREDITS_RULE:
      return (
        <CreditsRule rule={rule} hlevel={hlevel} hints={hints} index={index} />
      );
    default:
      return null;
  }
};

Rule.defaultProps = {
  index: 0
};

Rule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  parent: hintType.isRequired,
  index: number
};

export default Rule;
