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
  STUDIES_HOST_BASE_URL, studiesCourseUnits, studiesStudyModules, studiesDegreeProgrammes
} from '../config';
import { LIST_ITEM_RULES, ruleTypes } from '../constants';
import InfoBox from '../components/InfoBox';
import styles from '../components/RootModule/rootModule.css';

const { COURSE_UNIT_RULE } = ruleTypes;

const getMinMaxString = (min, max, minLabel) => {
  if (!max && minLabel) {
    return `${minLabel} ${min}`;
  }
  if (min === max || !max) {
    return `${min}`;
  }
  return `${min}–${max}`;
};

const isModuleEducation = (module) => module.type === 'Education';

export const creditsToString = (credits, translate, showMinSPRequirement = false) => {
  if (!credits) {
    return null;
  }

  const { max, min } = credits;
  const spLabel = translate('creditLabel');
  const minLabel = (showMinSPRequirement) ? translate('atLeast') : '';
  const creditsString = getMinMaxString(min, max, minLabel);

  return `${creditsString} ${spLabel}`;
};

export const requiredCoursesToString = (requiredCourses) => {
  const { max, min } = requiredCourses;
  return getMinMaxString(min, max);
};

export const getLocalizedText = (field, lang) => field[lang] || field.fi || field.en || field.sv;

export const getName = (rule, lang) => (rule.dataNode?.name ? getLocalizedText(rule.dataNode.name, lang) : '');

const compareCodes = (rule1, rule2) => {
  const getCode = (rule) => rule.dataNode.code || '';
  const codeLength = (rule) => getCode(rule).length;

  if (codeLength(rule1) === codeLength(rule2)) {
    return (getCode(rule1) < getCode(rule2)) ? -1 : 1;
  }

  if (codeLength(rule1) < codeLength(rule2)) {
    return -1;
  }

  if (codeLength(rule1) > codeLength(rule2)) {
    return 1;
  }

  return 0;
};

// Courses first, order by course code, then everything else
export const compareSubRules = (rule1, rule2) => {
  const isCourseUnitRule = (rule) => rule.type === COURSE_UNIT_RULE;

  if (isCourseUnitRule(rule1) && !isCourseUnitRule(rule2)) {
    return -1;
  }

  if (!isCourseUnitRule(rule1) && isCourseUnitRule(rule2)) {
    return 1;
  }

  if (isCourseUnitRule(rule1) && isCourseUnitRule(rule2)) {
    return compareCodes(rule1, rule2);
  }

  return 0;
};

export const calculateCurrentLV = () => {
  const today = new Date();
  // javascript months start from 0 and displayed year changes 1st of August.
  let lvYearCode;
  if (today.getMonth() < 7) {
    lvYearCode = today.getFullYear() - 1950;
  } else {
    lvYearCode = today.getFullYear() + 1 - 1950;
  }
  return `hy-lv-${lvYearCode}`;
};

export const getCode = (module) => (isModuleEducation(module)
  && module.dataNode?.code) || module.code;

export const renderRequiredCourseAmount = (rule, t) => {
  const { require, allMandatory } = rule;

  if (require?.min === 1 && require?.max === 1) {
    return (<div className={styles.creditRequirement}>{t('oneOfFollowing')}</div>);
  }

  const hasRequiredCoursesRange = require && (require.max || require.min > 0);
  if (!allMandatory && hasRequiredCoursesRange) {
    return (<div className={styles.creditRequirement}>{t('select')} {requiredCoursesToString(require)}</div>);
  }
  return null;
};

export const getDescription = (rule, lang) => {
  const { description: ruleDesc, localId } = rule;
  if (ruleDesc) {
    return (
      <InfoBox content={getLocalizedText(ruleDesc, lang)} id={`desc-${localId}`} setInnerHtml />
    );
  }
  return null;
};

export const sortAndRenderRules = (rules, renderRule) => {
  const sortedSubrules = rules?.sort(compareSubRules) || [];
  const listContent = sortedSubrules
    .filter((r) => LIST_ITEM_RULES.includes(r.type)).map(renderRule);
  const otherContent = sortedSubrules
    .filter((r) => !LIST_ITEM_RULES.includes(r.type)).map(renderRule);
  return [listContent, otherContent];
};

export const ariaLabelForTitle = (code, title, credits) => {
  const ariaCode = code ? `${code}: ` : '';
  const ariaCredits = credits ? `, ${credits}.` : '';
  return ariaCode + title + ariaCredits;
};

const studyYearParam = (studyYear) => (studyYear ? `?cpId=${studyYear}` : '');

export const getCourseUnitUrl = (id, lang, studyYear) =>
  STUDIES_HOST_BASE_URL + (studiesCourseUnits[lang] || studiesCourseUnits.fi) + id
  + studyYearParam(studyYear);

export const getStudyModuleUrl = (id, lang, studyYear) =>
  STUDIES_HOST_BASE_URL + (studiesStudyModules[lang] || studiesStudyModules.fi) + id
  + studyYearParam(studyYear);

export const getDegreeProgrammeUrl = (id, lang, studyYear) =>
  STUDIES_HOST_BASE_URL + (studiesDegreeProgrammes[lang] || studiesDegreeProgrammes.fi) + id
  + studyYearParam(studyYear);

export const isDegreeProgramme = (moduleOrDataNode) => moduleOrDataNode?.type === 'DegreeProgramme';

export const getSubRules = (rule) => {
  const { dataNode } = rule;
  if (dataNode?.rules && dataNode.rules.length) {
    return dataNode.rules;
  }
  return dataNode?.rule ? [dataNode.rule] : [];
};

export const countPotentialAccordions = (rules, stop = false) => rules.reduce((count, rule) => {
  if (rule.type === ruleTypes.MODULE_RULE && rule.dataNode?.id) {
    return count + 1;
  }
  if (rule.type === ruleTypes.CREDITS_RULE) {
    return count + countPotentialAccordions([rule.rule]);
  }
  if (rule.type === ruleTypes.COMPOSITE_RULE && !stop) {
    return count + countPotentialAccordions(rule.rules, true);
  }
  return count;
}, 0);
