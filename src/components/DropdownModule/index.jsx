import React, { Component, Fragment } from 'react';
import { string, bool } from 'prop-types';
import { oneOfRulesType } from '../../types';
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
    const { academicYear, showAll } = this.props;
    const { selected, modules } = this.state;

    if (selected !== NOTHING_SELECTED) {
      const module = modules.find(m => m.id === selected);
      return <GroupingModule academicYear={academicYear} module={module} showAll={showAll} />;
    }

    return null;
  }

  render() {
    const { selected, modules } = this.state;
    const { academicYear, showAll } = this.props;

    if (showAll) {
      return (
        <Fragment>
          {modules.map(module => (
            <GroupingModule
              key={module.localId}
              academicYear={academicYear}
              module={module}
              showAll={showAll}
            />
          ))}
        </Fragment>
      );
    }

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
  rule: oneOfRulesType.isRequired,
  showAll: bool.isRequired
};

export default DropdownModule;
