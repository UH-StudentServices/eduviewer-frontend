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

export const ruleTypes = {
  ANY_COURSE_UNIT_RULE: 'AnyCourseUnitRule',
  ANY_MODULE_RULE: 'AnyModuleRule',
  COMPOSITE_RULE: 'CompositeRule',
  COURSE_UNIT_RULE: 'CourseUnitRule',
  CREDITS_RULE: 'CreditsRule',
  MODULE_RULE: 'ModuleRule'
};

export const availableLanguages = {
  FI: 'fi',
  SV: 'sv',
  EN: 'en'
};

export const DEFAULT_LANG = availableLanguages.FI;

export const NO_DEGREE_PROGRAM_CODE = 'no_degree_programme';

export const NO_MODULE_HIERARCHY = {};

export const LIST_ITEM_RULES = [ruleTypes.ANY_COURSE_UNIT_RULE, ruleTypes.ANY_MODULE_RULE,
  ruleTypes.COURSE_UNIT_RULE];

export const STUDY_TRACK_DROPDOWN_MODULES = [
  'opintosuunta',
  'study track',
  'studieinriktningen'
];

export const SPECIALISATION_DROPDOWN_MODULES = [
  'suuntautuminen',
  'inriktning',
  'specialisation'
];

export const FOREIGN_LANGUAGE_DROPDOWN_MODULES = [
  'vieras kieli',
  'foreign language',
  'främmande språk'
];
