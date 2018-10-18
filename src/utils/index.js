/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-fronted is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-fronted is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-fronted.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ruleTypes } from '../constants';

const { COURSE_UNIT_RULE } = ruleTypes;

const getMinMaxString = (min, max, showMinRequirement = false) => {
  const minLabel = 'väh.';

  let minMaxString;

  if (!max && showMinRequirement) {
    minMaxString = `${minLabel} ${min}`;
  } else if (min === max || !max) {
    minMaxString = `${min}`;
  } else {
    minMaxString = `${min} - ${max}`;
  }
  return minMaxString;
};

export const creditsToString = (credits, showMinSPRequirement = false) => {
  if (!credits) {
    return null;
  }

  const { max, min } = credits;
  const spLabel = 'op';

  const creditsString = getMinMaxString(min, max, showMinSPRequirement);

  return `${creditsString} ${spLabel}`;
};

export const requiredCoursesToString = (requiredCourses) => {
  const { max, min } = requiredCourses;
  return getMinMaxString(min, max);
};

export const getName = rule => (rule.dataNode ? rule.dataNode.name.fi : '');

const compareCodes = (rule1, rule2) => {
  const getCode = rule => rule.dataNode.code || '';
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

export const getDegreeProgramCode = degreeProgram =>
  (degreeProgram.dataNode ? degreeProgram.dataNode.code : null);
