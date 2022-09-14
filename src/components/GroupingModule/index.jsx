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
  func, bool, shape, number
} from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';

import { ruleTypes } from '../../constants';
import {
  compareSubRules, creditsToString, getLocalizedText, getName, requiredCoursesToString
} from '../../utils';

import DropdownModule from '../DropdownModule'; // eslint-disable-line
import AccordionModule from '../AccordionModule'; // eslint-disable-line
import Course from '../Course';

import styles from './groupingModule.css';
import InfoBox from '../InfoBox';
import { activeLanguageType } from '../../types';

const {
  ANY_COURSE_UNIT_RULE,
  ANY_MODULE_RULE,
  COMPOSITE_RULE,
  COURSE_UNIT_RULE,
  CREDITS_RULE,
  MODULE_RULE
} = ruleTypes;

const STUDY_TRACK_DROPDOWN_MODULES = [
  'opintosuunta',
  'study track',
  'studieinriktningen'
];

const FOREIGN_LANGUAGE_DROPDOWN_MODULES = [
  'vieras kieli',
  'foreign language',
  'främmande språk'
];

const ONE_OF_FOLLOWING = [
  'Jokin seuraavista',
  'En av följande',
  'One of the following'
];

const DROPDOWN_MODULES = [
  ...STUDY_TRACK_DROPDOWN_MODULES
];

const ACCORDION_MODULES = [
  ...FOREIGN_LANGUAGE_DROPDOWN_MODULES
];

const getDescription = (rule, lang, isCompositeRule = false) => {
  const { description: ruleDesc, dataNode, allMandatory } = rule;
  const nodeDesc = dataNode && dataNode.description;

  const description = ruleDesc || nodeDesc;
  const renderDescription = !(isCompositeRule && allMandatory);

  if (!description || !renderDescription) {
    return null;
  }

  return <InfoBox content={getLocalizedText(description, lang)} setInnerHtml />;
};

const getSubRules = (rule) => {
  const { rules, dataNode } = rule;

  let subRules = rules || (dataNode && dataNode.rules) || [];

  if (subRules.length === 0) {
    subRules = [dataNode ? dataNode.rule : rule];
  }

  return subRules;
};

const GroupingModule = ({
  showAll,
  translate,
  activeLanguage,
  rule: groupingModuleRule,
  level
}) => {
  if (!groupingModuleRule) {
    return null;
  }
  const lang = activeLanguage.code;

  const renderRequiredCourseAmount = (rule) => {
    const { require, allMandatory } = rule;
    const hasRequiredCoursesRange = require && (require.max || require.min > 0);
    const shouldRender = !allMandatory && hasRequiredCoursesRange;

    if (require?.min === 1 && require?.max === 1) {
      return translate('oneOfFollowing');
    }

    if (shouldRender) {
      return `${translate('select')} ${requiredCoursesToString(require)}`;
    }
    return null;
  };

  const renderRule = (rule) => {
    if (rule) {
      if (rule.type === COMPOSITE_RULE) {
        const requiredCourseAmount = renderRequiredCourseAmount(rule);
        return (
          <Fragment key={rule.localId}>
            { requiredCourseAmount
              && <span className={styles.compositeRuleCourseAmounts}>{requiredCourseAmount}</span>}
            { getDescription(rule, true, activeLanguage.code) }
            <ul className={styles.groupingList}>
              {rule.rules.sort(compareSubRules).map(renderRule)}
            </ul>
          </Fragment>
        );
      }

      if (rule.type === ANY_COURSE_UNIT_RULE) {
        return <li key={rule.localId}><span className={styles.paddingLeft05}><Translate id="anyCourseUnit" /></span></li>;
      }

      if (rule.type === ANY_MODULE_RULE) {
        return <li key={rule.localId}><span className={styles.paddingLeft05}><Translate id="anyModule" /></span></li>;
      }

      if (rule.type === COURSE_UNIT_RULE) {
        const {
          id, code, name, credits
        } = rule.dataNode;
        const isValidCourse = code && name && credits;

        if (!isValidCourse) {
          return null;
        }

        return (
          <Course key={rule.localId} id={id} code={code} name={name} credits={credits} />
        );
      }

      if (rule.type === CREDITS_RULE) {
        return (
          <Fragment key={rule.localId}>
            <div className={level === 0 ? styles.paddingBottom1 : styles.paddingLeft1}>{translate('total')} {creditsToString(rule.credits, translate)}</div>
            {renderRule(rule.rule)}
          </Fragment>
        );
      }

      if (rule.type === MODULE_RULE) {
        return (
          <GroupingModule
            key={rule.localId}
            rule={rule}
            showAll={showAll}
            translate={translate}
            activeLanguage={activeLanguage}
            level={level + 1}
          />
        );
      }
    }
    return null;
  };

  const shouldRenderDropdown = DROPDOWN_MODULES.includes(
    getName(groupingModuleRule, lang).toLowerCase()
  );
  const shouldRenderAccordion = ACCORDION_MODULES.includes(
    getName(groupingModuleRule, lang).toLowerCase()
  );

  const moduleCredits = groupingModuleRule.type === MODULE_RULE
    && creditsToString(groupingModuleRule.dataNode.targetCredits, translate, true);
  const moduleCode = groupingModuleRule.type === MODULE_RULE && groupingModuleRule.dataNode.code;

  if (shouldRenderDropdown && !showAll) {
    return (
      <div key={groupingModuleRule.localId} className={`${styles.groupingModule} ${styles.dropdown}`}>
        <div className={styles.groupingTitle}>{getName(groupingModuleRule, lang)}</div>
        <DropdownModule rule={groupingModuleRule} showAll={showAll} />
      </div>
    );
  }

  if (shouldRenderAccordion && !showAll) {
    return (
      <div key={groupingModuleRule.localId} className={styles.groupingModule}>
        <AccordionModule
          rule={groupingModuleRule}
          showAll={showAll}
          internalAccordion
        />
      </div>
    );
  }

  const isEmptyDataNode = Object.keys(groupingModuleRule.dataNode || {}).length === 0;

  if (!isEmptyDataNode && !showAll) {
    return (
      <div key={groupingModuleRule.localId} className={styles.groupingModule}>
        <AccordionModule
          rule={groupingModuleRule}
          showAll={showAll}
          internalAccordion={false}
        />
      </div>
    );
  }

  const name = getName(groupingModuleRule, lang);

  return (
    <div
      id={groupingModuleRule.localId}
      key={groupingModuleRule.localId}
      className={styles.groupingModule}
    >
      {name && level !== 0
        && (
          <strong className={`${styles.groupingTitle} ${styles.paddingLeft1}`}>
            {moduleCode && <span>{moduleCode} </span>}
            <span>{name}</span>
            {moduleCredits && <span className={styles.moduleCredits}>{moduleCredits}</span>}
          </strong>
        )}
      <div>
        {(level === 99
          && ONE_OF_FOLLOWING.includes(renderRequiredCourseAmount(groupingModuleRule)))
          ? (
            <span className={styles.paddingLeft1}>
              { renderRequiredCourseAmount(groupingModuleRule) }
            </span>
          )
          : renderRequiredCourseAmount(groupingModuleRule)}
        { getDescription(groupingModuleRule, lang) }
        { getSubRules(groupingModuleRule).sort(compareSubRules).map((r) => renderRule(r)) }
      </div>
    </div>
  );
};

GroupingModule.defaultProps = {
  level: 0
};

GroupingModule.propTypes = {
  showAll: bool.isRequired,
  rule: shape({}).isRequired,
  translate: func.isRequired,
  activeLanguage: activeLanguageType.isRequired,
  level: number
};

export default withLocalize(GroupingModule);
