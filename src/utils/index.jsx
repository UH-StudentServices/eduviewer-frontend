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
import {
  STUDIES_HOST_BASE_URL, studiesCourseUnits, studiesStudyModules, studiesDegreeProgrammes
} from '../config';
import {
  LIST_ITEM_RULES,
  ruleTypes
} from '../constants';

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

export const isEducation = (module) => module.type === 'Education';

export const isStudyModule = (dataNode) => dataNode?.type === 'StudyModule';

export const isDegreeProgramme = (moduleOrDataNode) => moduleOrDataNode?.type === 'DegreeProgramme';

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

export const hasCreditRequirement = (rule) => {
  const { require, allMandatory } = rule;
  return !allMandatory && require && (require.max || require.min > 0);
};

export const getLocalizedTextWithLangCode = (field, lang) => {
  const key = [lang, 'fi', 'en', 'sv'].find((k) => field[k]);
  return key ? [field[key], key] : [undefined, undefined];
};

export const getLocalizedText = (field, lang) => getLocalizedTextWithLangCode(field, lang)[0];

export const hasName = (dataNode) =>
  dataNode?.name
  && Object.values(dataNode.name).some((name) => !!name);

export const getNameWithLangCode = (rule, lang) => (
  hasName(rule.dataNode)
    ? getLocalizedTextWithLangCode(rule.dataNode.name, lang)
    : [undefined, undefined]
);

export const getName = (rule, lang) => (hasName(rule.dataNode) ? getLocalizedText(rule.dataNode.name, lang) : '');

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

export const getCode = (module) => (isEducation(module)
  && module.dataNode?.code) || module.code;

export const getSubRules = (rule) => {
  const { dataNode } = rule;
  if (dataNode?.rules?.length) {
    return dataNode.rules;
  }
  return dataNode?.rule ? [dataNode.rule] : [];
};

export const getRules = (rule) => {
  if (rule.type === ruleTypes.MODULE_RULE) {
    return getSubRules(rule);
  }
  return rule.rules ?? [];
};

const partition = (array, predicate) =>
  array.reduce((acc, item) => {
    acc[predicate(item) ? 0 : 1].push(item);
    return acc;
  }, [[], []]);

export const sortAndRenderRules = (rule, renderRule) => {
  const rules = getRules(rule);
  const sortedSubrules = rules?.sort(compareSubRules) || [];
  const isListItemRule = (r) =>
    LIST_ITEM_RULES.includes(r.type)
    || (rule.type === ruleTypes.COMPOSITE_RULE && r.type === ruleTypes.MODULE_RULE);
  const [listContent, otherContent] = partition(
    sortedSubrules.map((r, i) => [r, i]),
    ([r]) => isListItemRule(r)
  );
  return [
    listContent.map(([r, i]) => renderRule({ isListItem: true })(r, i)),
    otherContent.map(([r, i]) => renderRule()(r, i))
  ];
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

export const hasCreditsRule = (dataNode) => dataNode?.rule?.type === ruleTypes.CREDITS_RULE;

export const hasGradeScaleId = (dataNode) => !!dataNode?.gradeScaleId;

export const isAccordion = (parent, rule) => (
  rule.type === ruleTypes.MODULE_RULE
  && hasName(rule.dataNode)
  && (
    parent?.hasCourseUnits
  || (parent?.ruleType === ruleTypes.COMPOSITE_RULE && parent?.rulesCount > 1)
  )
);

export const getOrdinals = (hints) => {
  const ordinals = [];
  let current = hints;
  while (current) {
    if (current.ordinal) {
      ordinals.push(current.ordinal);
    }
    current = current.parent;
  }
  return ordinals.reverse();
};

/**
 * Converts a number to corresponding letter(s). 1 -> A, 2 -> B, ..., 26 -> Z, 27 -> AA, etc.
 *
 * @param {number} n - The number to convert
 * @returns {string} Corresponding letter(s) for the number
 */
export const numberToLetter = (n) => {
  if (n <= 26) {
    return String.fromCodePoint(64 + n);
  }

  // For numbers > 26, use double letters
  const firstLetter = Math.floor((n - 27) / 26) + 1;
  const secondLetter = ((n - 27) % 26) + 1;

  return String.fromCodePoint(64 + firstLetter) + String.fromCodePoint(64 + secondLetter);
};

export const formatOrdinal = (ordinal, index) => (
  index % 2 === 0
    ? ordinal
    : numberToLetter(ordinal)
);

export const getOrdinalString = (hints) =>
  getOrdinals(hints).map(formatOrdinal).join('');

export const getOrdinalRangeString = (hints, rulesCount) => {
  const ordinals = getOrdinals(hints);
  if (rulesCount === 0) {
    return '';
  }
  const ordinalsCount = ordinals.length;
  const rangeStart = formatOrdinal(1, ordinalsCount);
  const rangeEnd = formatOrdinal(rulesCount, ordinalsCount);
  if (ordinalsCount === 0) {
    return `${rangeStart}–${rangeEnd}`;
  }
  const formattedOrdinals = ordinals.map((ordinal, index) => formatOrdinal(ordinal, index));
  return `${formattedOrdinals.join('')}${rangeStart}–${formattedOrdinals.join('')}${rangeEnd}`;
};

export function* idGenerator(id) {
  let currentId = 1;
  while (true) {
    yield `${id}-${currentId}`;
    currentId += 1;
  }
}

export const isInRange = (num, min, max) =>
  num >= min && (max === null || num <= max);

export const getLangAttribute = (lang, langCode) => (lang === langCode ? null : langCode);

export const getHeadingSizeForLevel = (level) => {
  const minHeadingSize = 'xxs';
  const levelToHeadingSizeMap = {
    1: 'md',
    2: 'md',
    3: 'md',
    4: 'sm',
    5: 'xs',
    6: minHeadingSize
  };
  return levelToHeadingSizeMap[level] ?? minHeadingSize;
};
