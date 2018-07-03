import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { degreeProgramType } from '../../types';
import { fetchEducation } from '../../api';

import GroupingModule from '../GroupingModule';
import Loader from '../Loader';

import styles from './degreeProgram.css';

class DegreeProgram extends Component {
  state = {
    isLoading: true,
    degreeProgram: {}
  }

  componentDidMount() {
    this.fetchRules();
  }

  async fetchRules() {
    this.setState({ isLoading: true });
    const { academicYear, degreeProgram } = this.props;

    const education = await fetchEducation(academicYear, degreeProgram.groupId);

    this.setState({ isLoading: false, degreeProgram: education });
  }

  render() {
    const { academicYear, showAll } = this.props;
    const { isLoading, degreeProgram } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    console.log(degreeProgram);
    const { name } = degreeProgram;

    return (
      <div className={styles.degreeProgram}>
        <h4>{name.fi}</h4>
        <div className={styles.moduleGroups}>
          <GroupingModule
            key={degreeProgram.dataNode.rule.localId}
            academicYear={academicYear}
            rule={degreeProgram.dataNode.rule}
            showAll={showAll}
          />
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
