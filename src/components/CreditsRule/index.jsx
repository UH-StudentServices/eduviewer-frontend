/* eslint-disable */

import React from 'react';

import Rule from '../Rule';

export default class CreditsRule extends React.Component {
  creditsRow(credits) {
    let creditsRow = '';
    if (credits.max == null || credits.min == credits.max) {
      creditsRow = `${credits.min} op`;
    } else {
      creditsRow = `${credits.min}-${credits.max} op`;
    }
    return (
      <li>
        Valitse
        {creditsRow}
      </li>
    );
  }

  render() {
    const rule = this.props.rule;
    const credits = rule.credits;
    return (
      <ul>
        {this.creditsRow(credits)}
        {<Rule key={rule.rule.localId} rule={rule.rule} lv={this.props.lv} elem={this.props.elem} />}
      </ul>
    );
  }
}
