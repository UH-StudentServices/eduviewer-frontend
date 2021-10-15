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

import React, { Component, Fragment } from 'react';
import { func, bool, shape } from 'prop-types';
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

const DROPDOWN_MODULES = [
  ...STUDY_TRACK_DROPDOWN_MODULES
];

const ACCORDION_MODULES = [
  ...FOREIGN_LANGUAGE_DROPDOWN_MODULES
];

const getDescription = (rule, isCompositeRule = false, lang) => {
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

const renderRequiredCourseAmount = (rule, translate) => {
  const { require, allMandatory } = rule;
  const hasRequiredCoursesRange = require && (require.max || require.min > 0);
  const shouldRender = !allMandatory && hasRequiredCoursesRange;
  return shouldRender
    ? <InfoBox content={`${translate('select')} ${requiredCoursesToString(require)}`} />
    : null;
};

class GroupingModule extends Component {
  constructor(props) {
    super(props);

    this.renderRule = this.renderRule.bind(this);
    this.render = this.render.bind(this);
  }

  renderRule(rule) {
    const { showAll, translate, activeLanguage } = this.props;

    if (rule) {
      if (rule.type === COMPOSITE_RULE) {
        return (
          <div key={rule.localId}>
            {renderRequiredCourseAmount(rule, translate)}
            {getDescription(rule, true, activeLanguage.code)}
            <ul className={styles.groupingList}>
              {rule.rules.sort(compareSubRules).map(this.renderRule)}
            </ul>
          </div>
        );
      }

      if (rule.type === ANY_COURSE_UNIT_RULE) {
        return <li key={rule.localId}><Translate id="anyCourseUnit" /></li>;
      }

      if (rule.type === ANY_MODULE_RULE) {
        return <li key={rule.localId}><Translate id="anyModule" /></li>;
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
            <InfoBox content={`${translate('select')} ${creditsToString(rule.credits, activeLanguage.code)}`} />
            {this.renderRule(rule.rule)}
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
          />
        );
      }
    }

    return null;
  }

  render() {
    const {
      rule, showAll, activeLanguage, translate
    } = this.props;
    const lang = activeLanguage.code;

    if (!rule) {
      return null;
    }
    const shouldRenderDropdown = DROPDOWN_MODULES.includes(getName(rule, lang).toLowerCase());
    const shouldRenderAccordion = ACCORDION_MODULES.includes(getName(rule, lang).toLowerCase());
    const moduleCredits = rule.type === MODULE_RULE
      && creditsToString(rule.dataNode.targetCredits, lang, true);
    const moduleCode = rule.type === MODULE_RULE && rule.dataNode.code;

    if (shouldRenderDropdown && !showAll) {
      return (
        <div key={rule.localId} className={styles.groupingModule}>
          <div className={styles.groupingTitle}>{getName(rule, lang)}</div>
          <DropdownModule rule={rule} showAll={showAll} />
        </div>
      );
    }

    if (shouldRenderAccordion && !showAll) {
      return (
        <div key={rule.localId} className={styles.groupingModule}>
          <AccordionModule rule={rule} showAll={showAll} />
        </div>
      );
    }

    return (
      <div id={rule.localId} key={rule.localId} className={styles.groupingModule}>
        <strong className={styles.groupingTitle}>
          {moduleCode ? `${moduleCode} ` : ''}
          {getName(rule, lang)}
          {moduleCredits ? ` (${moduleCredits})` : ''}
        </strong>
        { renderRequiredCourseAmount(rule, translate) }
        { getDescription(rule, lang) }
        { getSubRules(rule).sort(compareSubRules).map((r) => this.renderRule(r)) }
      </div>
    );
  }
}

GroupingModule.propTypes = {
  showAll: bool.isRequired,
  rule: shape({}).isRequired,
  translate: func.isRequired,
  activeLanguage: activeLanguageType.isRequired
};

export default withLocalize(GroupingModule);
