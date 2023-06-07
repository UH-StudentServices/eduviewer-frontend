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

import React, { Component } from 'react';
import { bool, number } from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { activeLanguageType, oneOfRulesType } from '../../types';
import { getName } from '../../utils';

import styles from './dropdownModule.css';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';

const NOTHING_SELECTED = '-';

class DropdownModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: NOTHING_SELECTED
    };

    this.onSelectChange = this.onSelectChange.bind(this);
    this.render = this.render.bind(this);
  }

  onSelectChange(event) {
    const { value } = event.target;
    this.setState({ selected: value });
  }

  render() {
    const { selected } = this.state;
    const {
      showAll, rule, activeLanguage: lang, hlevel, insideAccordion
    } = this.props;
    const subRules = rule.dataNode.rule.rules;
    const selectedRule = selected !== NOTHING_SELECTED
      && subRules.find((subRule) => subRule.localId === selected);

    if (showAll) {
      return rule.dataNode.rules.map((r) => (
        <Rule
          key={r.localId}
          rule={rule}
          showAll={showAll}
          activeLanguage={lang}
          hlevel={hlevel}
        />
      ));
    }
    return (
      <div className={styles.dropdownContainer} key={rule.localId}>
        <label className={styles.label} htmlFor={`select-${rule.localId}`}>{getName(rule, lang)}</label>
        <div className={styles.selectContainer}>
          <select value={selected} id={`select-${rule.localId}`} onChange={this.onSelectChange}>
            <option value="-">-</option>
            {subRules.map((subRule) => (
              <option key={subRule.localId} value={subRule.localId}>
                {getName(subRule, lang.code)}
              </option>
            ))}
          </select>
        </div>
        {selectedRule ? (
          <Rule
            rule={selectedRule}
            showAll={showAll}
            hlevel={hlevel}
            insideAccordion={insideAccordion}
            isDegreeProgramme
          />
        ) : null}
      </div>
    );
  }
}

DropdownModule.propTypes = {
  rule: oneOfRulesType.isRequired,
  showAll: bool.isRequired,
  activeLanguage: activeLanguageType.isRequired,
  hlevel: number.isRequired,
  insideAccordion: bool.isRequired
};

export default withLocalize(DropdownModule);
