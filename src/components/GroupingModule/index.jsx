import React, { Component } from 'react';
import { elemType } from '../../types';

const getDescription = (rule) => {
  const { description } = rule;
  return description ? <div dangerouslySetInnerHTML={{ __html: description.fi }} /> : null;
};

export default class GroupingModule extends Component {
  // eslint-disable-next-line
  renderRule(rule) {
    if (rule.type === 'CompositeRule') {
      return (
        <div>
          {getDescription(rule)}
          <ul>{rule.rules.map(this.renderRule)}</ul>
        </div>
      );
    }

    if (rule.type === 'AnyCourseUnitRule') {
      return <li>Mikä tahansa opintojakso</li>;
    }

    if (rule.type === 'AnyModuleRule') {
      return <li>Mikä tahansa opintokokonaisuus</li>;
    }

    return null;
  }

  render() {
    const { module } = this.props;
    const { name, rule } = module;

    return (
      <div>
        <strong>{name.fi}</strong>
        {this.renderRule(rule)}
      </div>
    );
  }
}

GroupingModule.propTypes = {
  module: elemType.isRequired
};
