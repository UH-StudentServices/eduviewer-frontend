import React, { Component, Fragment } from 'react';
import { bool, shape } from 'prop-types';

import { ruleTypes } from '../../constants';
import { creditsToString, getName } from '../../utils';

import DropdownModule from '../DropdownModule'; // eslint-disable-line
import Course from '../Course';

import styles from './groupingModule.css';

const {
  ANY_COURSE_UNIT_RULE, ANY_MODULE_RULE, COMPOSITE_RULE, COURSE_UNIT_RULE,
  CREDITS_RULE, MODULE_RULE
} = ruleTypes;

const DROPDOWN_MODULES = ['opintosuunta', 'study track', 'vieras kieli', 'foreign language'];

const getDescription = (rule) => {
  const { description: ruleDesc, dataNode } = rule;
  const nodeDesc = dataNode && dataNode.description;

  if (!ruleDesc && !nodeDesc) {
    return null;
  }
  const description = ruleDesc || nodeDesc;
  return description
    ? (
      <div className={styles.descriptionContainer}>
        <span className={`${styles.iconContainer} icon--info`} />
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: description.fi }} />
      </div>
    )
    : null;
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
      console.log(rule);
      return (
        <div key={rule.localId}>
          {getDescription(rule)}
          <ul>{rule.rules.map(this.renderRule)}</ul>
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
          <div>Valitse {creditsToString(rule.credits)} op</div>
          {this.renderRule(rule.rule)}
        </Fragment>
      );
    }

    if (rule.type === MODULE_RULE) {
      return <GroupingModule key={rule.localId} rule={rule} showAll={showAll} />;
    }

    // Log rule if it is not rendered
    console.log(rule);
    return null;
  };

  render() {
    const { rule, showAll } = this.props;
    const shouldRenderDropdown = () => DROPDOWN_MODULES.includes(getName(rule).toLowerCase());

    if (shouldRenderDropdown() && !showAll) {
      return (
        <div key={rule.localId}>
          <strong>{getName(rule)}</strong>
          <DropdownModule rule={rule} showAll={showAll} />
        </div>
      );
    }

    return (
      <div key={rule.localId}>
        <strong>{getName(rule)}</strong>
        { getDescription(rule) }
        { getSubRules(rule).map(r => this.renderRule(r)) }
      </div>
    );
  }
}

GroupingModule.propTypes = {
  showAll: bool.isRequired,
  rule: shape({}).isRequired
};
