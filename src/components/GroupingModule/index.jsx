import React, { Component, Fragment } from 'react';
import { bool, string } from 'prop-types';

import { elemType } from '../../types';
import { fetchAllIdsJson } from '../../api';
import { rules, modules } from '../../constants';
import { creditsToString, getModuleGroupIds } from '../../utils';

import StudyModule from '../StudyModule'; // eslint-disable-line
import DropdownModule from '../DropdownModule'; // eslint-disable-line
import CourseUnitRule from '../CourseUnitRule';

import styles from './groupingModule.css';

const {
  ANY_COURSE_UNIT_RULE,
  ANY_MODULE_RULE,
  COMPOSITE_RULE,
  COURSE_UNIT_RULE,
  CREDITS_RULE
} = rules;

const { GROUPING_MODULE, STUDY_MODULE } = modules;

const DROPDOWN_MODULES = ['opintosuunta', 'study track', 'vieras kieli', 'foreign language'];

const getDescription = (rule) => {
  const { description } = rule;
  return description
    ? (
      <div className={styles.descriptionContainer}>
        <span className={`${styles.iconContainer} icon--info`} />
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: description.fi }} />
      </div>
    )
    : null;
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
    const { rule } = module;
    const moduleIds = getModuleGroupIds(rule);

    fetchAllIdsJson(academicYear, moduleIds)
      .then(subModules => this.setState({ subModules }));
  }

  renderRule = (rule) => {
    const { academicYear } = this.props;

    if (rule.type === COMPOSITE_RULE) {
      return (
        <div key={rule.localId}>
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
    const { academicYear, showAll } = this.props;

    if (module.type === GROUPING_MODULE) {
      return (
        <GroupingModule
          key={module.localId}
          academicYear={academicYear}
          module={module}
          showAll={showAll}
        />);
    }
    if (module.type === STUDY_MODULE) {
      return (
        <StudyModule
          key={module.code}
          academicYear={academicYear}
          module={module}
          showAll={showAll}
        />
      );
    }
    console.log('warning: module not rendered');
    return null;
  };

  render() {
    const { academicYear, module, showAll } = this.props;
    const { subModules } = this.state;
    const { name, rule } = module;
    const shouldRenderDropdown = () => DROPDOWN_MODULES.includes(module.name.fi.toLowerCase());

    if (shouldRenderDropdown() && !showAll) {
      return (
        <div>
          <strong>{name.fi}</strong>
          <DropdownModule academicYear={academicYear} rule={module.rule} showAll={showAll} />
        </div>
      );
    }

    return (
      <div id="groupingModule">
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
  module: elemType.isRequired,
  showAll: bool.isRequired
};
