import React, { Component } from 'react';
import { string, bool } from 'prop-types';
import { degreeProgramType } from '../../types';
import { fetchDegreeProgram } from '../../api';

import GroupingModule from '../GroupingModule';
import Loader from '../Loader';

import styles from './degreeProgram.css';
import ErrorMessage from '../ErrorMessage';

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

    try {
      const education = await fetchDegreeProgram(academicYear, degreeProgram.groupId);
      this.setState({ isLoading: false, degreeProgram: education });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { showAll } = this.props;
    const { isLoading, degreeProgram, error } = this.state;

    if (error) {
      return <ErrorMessage errorMessage={error} />;
    }

    if (isLoading) {
      return <Loader />;
    }

    const { name, dataNode } = degreeProgram;

    return (
      <div className={styles.degreeProgram}>
        <h4>{name.fi}</h4>
        <div className={styles.moduleGroups}>
          <GroupingModule
            key={dataNode.rule.localId}
            rule={dataNode.rule}
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
