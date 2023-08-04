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

import React, { Fragment } from 'react';
import {
  func, bool, shape, number, string
} from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';

import { ruleTypes } from '../../constants';
import {
  creditsToString
} from '../../utils';

import Course from '../Course';

import styles from '../RootModule/rootModule.css';
// eslint-disable-next-line import/no-cycle
import ModuleRule from '../ModuleRule';
// eslint-disable-next-line import/no-cycle
import CompositeRule from '../CompositeRule';

const Rule = ({
  translate: t,
  rule,
  insideAccordion,
  atFirstDegreeProgramme,
  closestTitleId,
  canBeAccordion,
  hlevel
}) => {
  if (!rule) {
    return null;
  }
  switch (rule.type) {
    case ruleTypes.COMPOSITE_RULE:
      return (
        <CompositeRule
          key={rule.localId}
          rule={rule}
          translate={t}
          insideAccordion={insideAccordion}
          hlevel={hlevel}
          canBeAccordion={canBeAccordion}
          closestTitleId={closestTitleId}
        />
      );
    case ruleTypes.MODULE_RULE:
      return (
        <ModuleRule
          key={rule.localId}
          rule={rule}
          translate={t}
          insideAccordion={insideAccordion}
          atFirstDegreeProgramme={atFirstDegreeProgramme}
          hlevel={hlevel}
          canBeAccordion={canBeAccordion}
          closestTitleId={closestTitleId}
        />
      );
    case ruleTypes.ANY_COURSE_UNIT_RULE:
      return <li key={rule.localId}><Translate id="anyCourseUnit" /></li>;
    case ruleTypes.ANY_MODULE_RULE:
      return <li key={rule.localId}><Translate id="anyModule" /></li>;
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
        />
      );
    }
    case ruleTypes.CREDITS_RULE: {
      const r = rule.rule;
      return (
        <Fragment key={rule.localId}>
          <div className={styles.creditsRule}>{t('total')} {creditsToString(rule.credits, t)}</div>
          {r && (
          <Rule
            key={r.localId}
            rule={r}
            translate={t}
            insideAccordion={insideAccordion}
            atFirstDegreeProgramme={atFirstDegreeProgramme}
            hlevel={hlevel}
            canBeAccordion={canBeAccordion}
            closestTitleId={closestTitleId}
          />
          )}
        </Fragment>
      );
    }
    default:
      return null;
  }
};

Rule.defaultProps = {
  insideAccordion: false,
  atFirstDegreeProgramme: false,
  canBeAccordion: false,
  closestTitleId: undefined
};

Rule.propTypes = {
  rule: shape({}).isRequired,
  translate: func.isRequired,
  hlevel: number.isRequired,
  insideAccordion: bool,
  atFirstDegreeProgramme: bool,
  canBeAccordion: bool,
  closestTitleId: string
};

export default withLocalize(Rule);
