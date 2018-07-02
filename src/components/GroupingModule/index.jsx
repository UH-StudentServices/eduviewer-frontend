import React, { Component } from 'react';
import { string } from 'prop-types';

import { elemType } from '../../types';
import { fetchAllIdsJson } from '../../api';
import StudyModule from '../StudyModule'; // eslint-disable-line
import CourseUnitRule from '../CourseUnitRule';

const getDescription = (rule) => {
  const { description } = rule;
  return description ? <div dangerouslySetInnerHTML={{ __html: description.fi }} /> : null;
};

export default class GroupingModule extends Component {
  state = {
    subModules: []
  };

  componentDidMount() {
    const { academicYear, module } = this.props;
    const { rule } = module;

    if (rule && rule.type === 'CompositeRule') {
      this.fetchSubmodules(module, academicYear);
    }
  }

  fetchSubmodules(module, academicYear) {
    const moduleIds = module.rule.rules
      .filter(rule => rule.type === 'ModuleRule')
      .map(rule => rule.moduleGroupId);

    fetchAllIdsJson(academicYear, moduleIds)
      .then(subModules => this.setState({ subModules }));
  }

  renderRule = (rule) => {
    const { academicYear } = this.props;

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

    if (rule.type === 'CourseUnitRule') {
      return (
        <CourseUnitRule
          key={rule.localId}
          academicYear={academicYear}
          code={rule.courseUnitGroupId}
        />
      );
    }

    if (rule.type === 'CreditsRule') {
      return this.renderRule(rule.rule);
    }

    return null;
  };

  renderModule = (module) => {
    const { academicYear } = this.props;

    if (module.type === 'GroupingModule') {
      return <GroupingModule academicYear={academicYear} module={module} />;
    }
    if (module.type === 'StudyModule') {
      return (
        <StudyModule
          key={module.code}
          academicYear={academicYear}
          module={module}
        />
      );
    }
    console.log('warning: module not rendered');
    return null;
  };

  render() {
    const { module } = this.props;
    const { subModules } = this.state;
    const { name, rule } = module;

    return (
      <div>
        <strong>{name.fi}</strong>
        {this.renderRule(rule)}
        {subModules.map(subModule => this.renderModule(subModule))}
      </div>
    );
  }
}

GroupingModule.propTypes = {
  academicYear: string.isRequired,
  module: elemType.isRequired
};
