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
  arrayOf, shape, bool, string, number, oneOfType
} from 'prop-types';

export const localizedTextType = shape({
  en: string,
  fi: string.isRequired,
  sv: string
});

export const creditsType = shape({
  max: number,
  min: number.isRequired
});

export const ruleType = shape({
  localId: string.isRequired,
  moduleGroupId: string
});

export const rulesType = shape({
  allMandatory: bool,
  description: localizedTextType,
  localId: string.isRequired,
  require: shape({
    min: number.isRequired,
    max: number
  }),
  rules: arrayOf(ruleType),
  rule: ruleType,
  type: string.isRequired
});

export const oneOfRulesType = oneOfType([ruleType, rulesType]);

export const rootModuleType = shape({
  name: localizedTextType.isRequired,
  rule: oneOfRulesType.isRequired
});

export const selectOptionsType = arrayOf(shape({
  value: oneOfType([string, number]).isRequired,
  text: string
}));
