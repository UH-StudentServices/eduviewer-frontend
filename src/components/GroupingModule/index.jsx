import React, { Component, Fragment } from 'react';
import { bool, shape } from 'prop-types';

import { ruleTypes } from '../../constants';
import {
  compareSubRules, creditsToString, getName, requiredCoursesToString
} from '../../utils';

import DropdownModule from '../DropdownModule'; // eslint-disable-line
import Course from '../Course';

import styles from './groupingModule.css';
import InfoBox from '../InfoBox';

const {
  ANY_COURSE_UNIT_RULE,
  ANY_MODULE_RULE,
  COMPOSITE_RULE,
  COURSE_UNIT_RULE,
  CREDITS_RULE,
  MODULE_RULE
} = ruleTypes;

const DROPDOWN_MODULES = ['opintosuunta', 'study track', 'vieras kieli', 'foreign language'];

const getDescription = (rule, isCompositeRule = false) => {
  const { description: ruleDesc, dataNode, allMandatory } = rule;
  const nodeDesc = dataNode && dataNode.description;

  const description = ruleDesc || nodeDesc;
  const renderDescription = !(isCompositeRule && allMandatory);

  if (!description || !renderDescription) {
    return null;
  }

  return <InfoBox content={description.fi} setInnerHtml />;
};

const getSubRules = (rule) => {
  const { rules, dataNode } = rule;

  let subRules = rules || (dataNode && dataNode.rules) || [];

  if (subRules.length === 0) {
    subRules = [dataNode ? dataNode.rule : rule];
  }

  return subRules;
};

export default class GroupingModule extends Component {
  renderRule = (rule) => {
    const { showAll } = this.props;

    if (rule.type === COMPOSITE_RULE) {
      const requiredCourseAmount = rule.require;
      const renderRequiredCourseAmount = !rule.allMandatory && requiredCourseAmount
        && !(!requiredCourseAmount.max && requiredCourseAmount.min === 0);

      return (
        <div key={rule.localId} className={styles.compositeRule}>
          {renderRequiredCourseAmount
            && <InfoBox content={`Valitse ${requiredCoursesToString(requiredCourseAmount)}`} />
          }
          {getDescription(rule, true)}
          <ul>{rule.rules.sort(compareSubRules).map(this.renderRule)}</ul>
        </div>
      );
    }

    if (rule.type === ANY_COURSE_UNIT_RULE) {
      return <li key={rule.localId}>Mikä tahansa opintojakso</li>;
    }

    if (rule.type === ANY_MODULE_RULE) {
      return <li key={rule.localId}>Mikä tahansa opintokokonaisuus</li>;
    }

    if (rule.type === COURSE_UNIT_RULE) {
      const { code, name, credits } = rule.dataNode;
      return (
        <Course key={rule.localId} code={code} name={name} credits={credits} />
      );
    }

    if (rule.type === CREDITS_RULE) {
      return (
        <Fragment key={rule.localId}>
          <InfoBox content={`Valitse ${creditsToString(rule.credits)}`} />
          {this.renderRule(rule.rule)}
        </Fragment>
      );
    }

    if (rule.type === MODULE_RULE) {
      return <GroupingModule key={rule.localId} rule={rule} showAll={showAll} />;
    }

    return null;
  };

  render() {
    const { rule, showAll } = this.props;
    if (!rule) {
      return null;
    }
    const shouldRenderDropdown = DROPDOWN_MODULES.includes(getName(rule).toLowerCase());
    const moduleCredits = rule.type === MODULE_RULE
      && creditsToString(rule.dataNode.targetCredits, true);
    const moduleCode = rule.type === MODULE_RULE && rule.dataNode.code;

    if (shouldRenderDropdown && !showAll) {
      return (
        <div key={rule.localId} className={styles.groupingModule}>
          <strong className={styles.groupingTitle}>{getName(rule)}</strong>
          <DropdownModule rule={rule} showAll={showAll} />
        </div>
      );
    }

    return (
      <div id={rule.localId} key={rule.localId} className={styles.groupingModule}>
        <strong className={styles.groupingTitle}>
          {moduleCode ? `${moduleCode} ` : ''}
          {getName(rule)}
          {moduleCredits ? ` (${moduleCredits})` : ''}
        </strong>
        { getDescription(rule) }
        { getSubRules(rule).sort(compareSubRules).map(r => this.renderRule(r)) }
      </div>
    );
  }
}

GroupingModule.propTypes = {
  showAll: bool.isRequired,
  rule: shape({}).isRequired
};
