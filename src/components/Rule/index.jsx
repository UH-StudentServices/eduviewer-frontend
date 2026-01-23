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
import { shape, number } from 'prop-types';

import { ruleTypes } from '../../constants';
import Course from '../Course';
// eslint-disable-next-line import/no-cycle
import ModuleRule from '../ModuleRule';
// eslint-disable-next-line import/no-cycle
import CompositeRule from '../CompositeRule';
import useTranslation from '../../hooks/useTranslation';
import AnyCourse from '../AnyCourse';
import { extrasType, hintsType } from '../../types';
import WithHints from './WithHints';
// eslint-disable-next-line import/no-cycle
import CreditsRule from '../CreditsRule';

const Rule = ({
  rule,
  hlevel,
  hints,
  extras
}) => {
  const { t } = useTranslation();

  if (!rule) {
    return null;
  }

  switch (rule.type) {
    case ruleTypes.COMPOSITE_RULE:
      return (
        <WithHints hints={hints} rule={rule} extras={extras}>
          {(newHints) => (
            <CompositeRule
              key={rule.localId}
              rule={rule}
              hlevel={hlevel}
              hints={newHints}
            />
          )}
        </WithHints>
      );
    case ruleTypes.MODULE_RULE:
      return (
        <WithHints hints={hints} rule={rule} extras={extras}>
          {(newHints) => (
            <ModuleRule
              key={rule.localId}
              rule={rule}
              hlevel={hlevel}
              hints={newHints}
            />
          )}
        </WithHints>
      );
    case ruleTypes.ANY_COURSE_UNIT_RULE:
      return (
        <WithHints hints={hints} rule={rule} extras={extras}>
          {(newHints) => (
            <AnyCourse hints={newHints} key={rule.localId}>{t('anyCourseUnit')}</AnyCourse>
          )}
        </WithHints>
      );
    case ruleTypes.ANY_MODULE_RULE:
      return (
        <WithHints hints={hints} rule={rule} extras={extras}>
          {(newHints) => (
            <AnyCourse hints={newHints} key={rule.localId}>{t('anyModule')}</AnyCourse>
          )}
        </WithHints>
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
        <WithHints hints={hints} rule={rule} extras={extras}>
          {(newHints) => (
            <Course
              key={rule.localId}
              id={id}
              code={code}
              name={name}
              credits={credits}
              hints={newHints}
            />
          )}
        </WithHints>
      );
    }
    case ruleTypes.CREDITS_RULE:
      return (
        <CreditsRule
          rule={rule}
          hlevel={hlevel}
          hints={hints}
          extras={extras}
        />
      );
    default:
      return null;
  }
};

Rule.defaultProps = {
  hints: [],
  extras: {
    index: 0
  }
};

Rule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  hints: hintsType,
  extras: extrasType
};

export default Rule;
