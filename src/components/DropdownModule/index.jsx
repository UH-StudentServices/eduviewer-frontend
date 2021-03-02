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
import { bool } from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { activeLanguageType, oneOfRulesType } from '../../types';
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
      const selectedRule = subRules.find(subRule => subRule.localId === selected);
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
    const { showAll, rule, activeLanguage } = this.props;

    if (showAll) {
      return (
        <div className={styles.selectedContainer}>
          <Fragment>
            {rule.dataNode.rules.map(r => (
              <GroupingModule
                key={r.localId}
                rule={rule}
                showAll={showAll}
                activeLanguage={activeLanguage}
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
              <option key={subRule.localId} value={subRule.localId}>
                {getName(subRule, activeLanguage.code)}
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
  showAll: bool.isRequired,
  activeLanguage: activeLanguageType.isRequired
};

export default withLocalize(DropdownModule);
