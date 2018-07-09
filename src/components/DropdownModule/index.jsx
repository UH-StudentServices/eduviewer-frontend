import React, { Component, Fragment } from 'react';
import { bool } from 'prop-types';

import { oneOfRulesType } from '../../types';
import GroupingModule from '../GroupingModule'; // eslint-disable-line
import { getName } from '../../utils';

import styles from './dropdownModule.css';

const NOTHING_SELECTED = '-';

class DropdownModule extends Component {
  state = {
    selected: NOTHING_SELECTED
  };

  onSelectChange = (event) => {
    const { value } = event.target;
    this.setState({ selected: value });
  };

  renderSelectedModule() {
    const { showAll, rule } = this.props;
    const { selected } = this.state;

    const subRules = rule.dataNode.rule.rules;

    if (selected !== NOTHING_SELECTED) {
      const selectedRule = subRules.find(subRule => subRule.dataNode.id === selected);
      return (
        <div className={styles.selectedContainer}>
          <GroupingModule rule={selectedRule} showAll={showAll} />
        </div>
      );
    }

    return null;
  }

  render() {
    const { selected } = this.state;
    const { showAll, rule } = this.props;

    if (showAll) {
      return (
        <div className={styles.selectedContainer}>
          <Fragment>
            {rule.dataNode.rules.map(r => (
              <GroupingModule
                key={r.localId}
                rule={rule}
                showAll={showAll}
              />
            ))}
          </Fragment>
        </div>
      );
    }
    return (
      <div className={styles.dropdownContainer}>
        <div className={styles.selectContainer}>
          <select value={selected} onChange={this.onSelectChange}>
            <option value="-">-</option>
            {rule.dataNode.rule.rules.map(subRule => (
              <option key={subRule.dataNode.id} value={subRule.dataNode.id}>
                {getName(subRule)}
              </option>
            ))}
          </select>
        </div>
        {this.renderSelectedModule()}
      </div>
    );
  }
}

DropdownModule.propTypes = {
  rule: oneOfRulesType.isRequired,
  showAll: bool.isRequired
};

export default DropdownModule;
