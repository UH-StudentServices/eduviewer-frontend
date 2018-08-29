import { ruleTypes } from '../constants';

const { COURSE_UNIT_RULE } = ruleTypes;

export const creditsToString = (credits, showMinSPRequirement = false) => {
  if (!credits) {
    return null;
  }

  const { max, min } = credits;
  const spLabel = 'op';
  const minLabel = 'väh.';

  let creditsString;

  if (!max && showMinSPRequirement) {
    creditsString = `${minLabel} ${min}`;
  } else if (min === max || !max) {
    creditsString = min;
  } else {
    creditsString = `${min} - ${max}`;
  }

  return `${creditsString} ${spLabel}`;
};

export const getName = rule => (rule.dataNode ? rule.dataNode.name.fi : '');

const compareCodes = (rule1, rule2) => {
  const getCode = rule => rule.dataNode.code;
  const codeLength = rule => getCode(rule).length;

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
  const isCourseUnitRule = rule => rule.type === COURSE_UNIT_RULE;

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
