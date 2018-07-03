import React, { Component, Fragment } from 'react';
import { bool, shape } from 'prop-types';

import { rules } from '../../constants';
import { creditsToString } from '../../utils';

import DropdownModule from '../DropdownModule'; // eslint-disable-line
import Course from '../Course';

const {
  ANY_COURSE_UNIT_RULE, ANY_MODULE_RULE, COMPOSITE_RULE, COURSE_UNIT_RULE,
  CREDITS_RULE, MODULE_RULE
} = rules;

const DROPDOWN_MODULES = ['opintosuunta', 'study track', 'vieras kieli', 'foreign language'];

const getDescription = (rule) => {
  if (!rule.dataNode) {
    return null;
  }
  const { description } = rule.dataNode;
  return description ? <div dangerouslySetInnerHTML={{ __html: description.fi }} /> : null;
};

export default class GroupingModule extends Component {
  renderRule = (rule) => {
    const { showAll } = this.props;

    if (rule.type === COMPOSITE_RULE) {
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

    console.log(rule);
    return null;
  };

  render() {
    const { rule, showAll } = this.props;
    const shouldRenderDropdown = () =>
      rule.dataNode && DROPDOWN_MODULES.includes(rule.dataNode.name.fi.toLowerCase());

    if (shouldRenderDropdown() && !showAll) {
      return (
        <div key={rule.localId}>
          <strong>{rule.dataNode.name.fi}</strong>
          <DropdownModule rule={rule} showAll={showAll} />
        </div>
      );
    }

    let subRules = rule.rules || rule.dataNode.rules || [];

    if (subRules.length === 0) {
      subRules = [rule.dataNode.rule];
    }

    return (
      <div key={rule.localId}>
        <strong>{rule.dataNode ? rule.dataNode.name.fi : ''}</strong>
        { getDescription(rule) }
        { subRules.map(r => this.renderRule(r)) }
      </div>
    );
  }
}

GroupingModule.propTypes = {
  showAll: bool.isRequired,
  rule: shape({}).isRequired
};
