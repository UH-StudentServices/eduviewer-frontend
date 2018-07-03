import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { degreeProgramType } from '../../types';
import { fetchAllIdsJson } from '../../api';
import { rules } from '../../constants';

import GroupingModule from '../GroupingModule';
import Loader from '../Loader';

import styles from './degreeProgram.css';

class DegreeProgram extends Component {
  state = {
    isLoading: false,
    moduleGroups: []
  }

  componentDidMount() {
    this.fetchRules();
  }

  async fetchRules() {
    this.setState({ isLoading: true });
    const { academicYear, degreeProgram } = this.props;
    const { rule } = degreeProgram;

    const isModuleRule = r => r.type === rules.MODULE_RULE;

    const moduleGroupIds = rule.rules
      ? rule.rules.filter(isModuleRule).map(module => module.moduleGroupId)
      : [isModuleRule(rule) && rule.moduleGroupId];

    const moduleGroups = await fetchAllIdsJson(academicYear, moduleGroupIds);

    this.setState({ moduleGroups, isLoading: false });
  }

  render() {
    const { academicYear, degreeProgram, showAll } = this.props;
    const { isLoading, moduleGroups } = this.state;
    const { name } = degreeProgram;

    return (
      <div className={styles.degreeProgram}>
        <h4>{name.fi}</h4>
        {
          isLoading && <Loader />
        }
        <div className={styles.moduleGroups}>
          { showAll && <div>SHOW ALL TOGGLED</div>}
          {
            moduleGroups.map(group => (
              <GroupingModule
                key={group.code}
                academicYear={academicYear}
                module={group}
              />
            ))
          }
        </div>
      </div>);
  }
}

DegreeProgram.propTypes = {
  academicYear: string.isRequired,
  degreeProgram: degreeProgramType.isRequired,
  showAll: bool.isRequired
};

export default DegreeProgram;
