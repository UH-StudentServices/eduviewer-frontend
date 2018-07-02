import React, { Component, Fragment } from 'react';
import { string } from 'prop-types';

import { elemType } from '../../types';
import { fetchAllIdsJson } from '../../api';
import { rules, modules } from '../../constants';
import { creditsToString } from '../../utils';

import StudyModule from '../StudyModule'; // eslint-disable-line
import DropdownModule from '../DropdownModule'; // eslint-disable-line
import CourseUnitRule from '../CourseUnitRule';

const {
  ANY_COURSE_UNIT_RULE, ANY_MODULE_RULE, COMPOSITE_RULE, COURSE_UNIT_RULE,
  CREDITS_RULE, MODULE_RULE
} = rules;
const { GROUPING_MODULE, STUDY_MODULE } = modules;

const DROPDOWN_MODULES = ['opintosuunta', 'study track', 'vieras kieli', 'foreign language'];

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

    if (rule && rule.type === COMPOSITE_RULE) {
      this.fetchSubmodules(module, academicYear);
    }
  }

  fetchSubmodules(module, academicYear) {
    const moduleIds = module.rule.rules
      .filter(rule => rule.type === MODULE_RULE)
      .map(rule => rule.moduleGroupId);

    fetchAllIdsJson(academicYear, moduleIds)
      .then(subModules => this.setState({ subModules }));
  }

  renderRule = (rule) => {
    const { academicYear } = this.props;

    if (rule.type === COMPOSITE_RULE) {
      return (
        <div>
          {getDescription(rule)}
          <ul>{rule.rules.map(this.renderRule)}</ul>
        </div>
      );
    }

    if (rule.type === ANY_COURSE_UNIT_RULE) {
      return <li>Mikä tahansa opintojakso</li>;
    }

    if (rule.type === ANY_MODULE_RULE) {
      return <li>Mikä tahansa opintokokonaisuus</li>;
    }

    if (rule.type === COURSE_UNIT_RULE) {
      return (
        <CourseUnitRule
          key={rule.localId}
          academicYear={academicYear}
          code={rule.courseUnitGroupId}
        />
      );
    }

    if (rule.type === CREDITS_RULE) {
      return (
        <Fragment>
          <div>Valitse {creditsToString(rule.credits)} op</div>
          {this.renderRule(rule.rule)}
        </Fragment>
      );
    }

    return null;
  };

  renderModule = (module) => {
    const { academicYear } = this.props;

    if (module.type === GROUPING_MODULE) {
      return <GroupingModule key={module.localId} academicYear={academicYear} module={module} />;
    }
    if (module.type === STUDY_MODULE) {
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
    const { academicYear, module } = this.props;
    const { subModules } = this.state;
    const { name, rule } = module;

    if (DROPDOWN_MODULES.includes(module.name.fi.toLowerCase())) {
      return (
        <div>
          <strong>{name.fi}</strong>
          <DropdownModule academicYear={academicYear} rule={module.rule} />
        </div>
      );
    }

    return (
      <div>
        <strong>{name.fi}</strong>
        {getDescription(module)}
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
