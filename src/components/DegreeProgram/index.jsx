import React, { Component } from 'react';
import { string, bool, func } from 'prop-types';
import { degreeProgramType } from '../../types';
import { getDegreeProgram } from '../../api';

import GroupingModule from '../GroupingModule';
import Loader from '../Loader';

import styles from './degreeProgram.css';

class DegreeProgram extends Component {
  static propTypes = {
    academicYear: string.isRequired,
    degreeProgram: degreeProgramType.isRequired,
    showAll: bool.isRequired,
    handleError: func.isRequired,
    showContent: bool.isRequired
  };

  state = {
    isLoading: true,
    degreeProgram: {}
  }

  async componentDidMount() {
    await this.fetchRules();
  }

  async fetchRules() {
    this.setState({ isLoading: true });
    const { academicYear, degreeProgram: { degreeProgrammeCode }, handleError } = this.props;

    try {
      const education = await getDegreeProgram(degreeProgrammeCode, academicYear);
      this.setState({ isLoading: false, degreeProgram: education });
    } catch (error) {
      this.setState({ isLoading: false }, handleError(error));
    }
  }

  render() {
    const { showAll, showContent } = this.props;
    const { isLoading, degreeProgram } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (!showContent) {
      return null;
    }

    const { name, dataNode } = degreeProgram;

    return (
      <div className={styles.degreeProgram}>
        <h3>{name.fi}</h3>
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

export default DegreeProgram;
