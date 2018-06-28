/* eslint-disable */

import React from 'react';

import CompositeRule from '../OldApp/CompositeRule';
import CreditsRule from '../OldApp/CreditsRule';

export default class Rule extends React.Component {
  render() {
    const rule = this.props.rule;
    if (rule.type == 'CompositeRule') {
      return (<CompositeRule key={rule.id} rule={rule} lv={this.props.lv} elem={this.props.elem} />);
    } if (rule.type == 'CreditsRule') {
      return (<CreditsRule key={rule.id} rule={rule} lv={this.props.lv} elem={this.props.elem} />);
    } if (rule.type == 'AnyCourseUnitRule') {
      return (
        <li>
          Mikä tahansa opintojakso
        </li>
      );
    } if (rule.type == 'AnyModuleRule') {
      return (
        <li>
          Mikä tahansa opintokokonaisuus
        </li>
      );
    }
  }
}
