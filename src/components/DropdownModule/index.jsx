import React, { Component } from 'react';
import { string } from 'prop-types';
import { ruleType } from '../../types';
import { fetchAllIdsJson } from '../../api';
import GroupingModule from '../GroupingModule'; // eslint-disable-line

const NOTHING_SELECTED = '-';

class DropdownModule extends Component {
  state = {
    selected: NOTHING_SELECTED,
    modules: []
  };

  componentDidMount() {
    const { academicYear, rule } = this.props;
    const moduleGroupIds = rule.rules.map(r => r.moduleGroupId);

    fetchAllIdsJson(academicYear, moduleGroupIds)
      .then(modules => this.setState({ modules }));
  }

  onSelectChange = (event) => {
    const { value } = event.target;
    this.setState({ selected: value });
  };

  renderSelectedModule() {
    const { academicYear } = this.props;
    const { selected, modules } = this.state;

    if (selected !== NOTHING_SELECTED) {
      const module = modules.find(m => m.id === selected);
      return <GroupingModule academicYear={academicYear} module={module} />;
    }

    return null;
  }

  render() {
    const { selected, modules } = this.state;

    return (
      <div>
        <select value={selected} onChange={this.onSelectChange}>
          <option value="-">-</option>
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.name.fi}
            </option>
          ))}
        </select>
        {this.renderSelectedModule()}
      </div>
    );
  }
}

DropdownModule.propTypes = {
  academicYear: string.isRequired,
  rule: ruleType.isRequired
};

export default DropdownModule;
