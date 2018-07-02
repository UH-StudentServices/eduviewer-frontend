import React, { Component } from 'react';
import { string } from 'prop-types';
import { degreeProgramType } from '../../types';
import { fetchAllIdsJson } from '../../api';
import { rules } from '../../constants';

import styles from './degreeProgram.css';
import GroupingModule from '../GroupingModule';

class DegreeProgram extends Component {
  state = {
    isLoading: false,
    moduleGroups: []
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    this.fetchRules();
  }

  fetchRules() {
    const { academicYear, degreeProgram } = this.props;
    const modules = degreeProgram.rule.rules.filter(rule => rule.type === rules.MODULE_RULE);

    fetchAllIdsJson(academicYear, modules.map(module => module.moduleGroupId))
      .then(moduleGroups => this.setState({ moduleGroups, isLoading: false }));
  }

  render() {
    const { academicYear, degreeProgram } = this.props;
    const { isLoading, moduleGroups } = this.state;
    const { name } = degreeProgram;

    return (
      <div className={styles.degreeProgram}>
        <b>{name.fi}</b>
        {
          isLoading && <div>loading...</div>
        }
        {
          moduleGroups.map(group => (
            <GroupingModule
              key={group.code}
              academicYear={academicYear}
              module={group}
            />
          ))
        }
      </div>);
  }
}

DegreeProgram.propTypes = {
  academicYear: string.isRequired,
  degreeProgram: degreeProgramType.isRequired
};

export default DegreeProgram;
