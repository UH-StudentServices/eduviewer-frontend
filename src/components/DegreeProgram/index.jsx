import React, { Component } from 'react';
import { string } from 'prop-types';
import { degreeProgramType } from '../../types';
import { fetchAllIdsJson } from '../../api';

import styles from './degreeProgram.css';

class DegreeProgram extends Component {
  state = {
    isLoading: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { degreeProgram, academicYear } = this.props;
    const moduleGroupIds = [degreeProgram.rule.moduleGroupId];
    const moduleGroups = await fetchAllIdsJson(academicYear, moduleGroupIds);
    this.setState({
      isLoading: false,
      moduleGroups
    });
  }

  render() {
    const { degreeProgram } = this.props;
    const { isLoading, moduleGroups } = this.state;
    const { name } = degreeProgram;

    return (
      <div className={styles.degreeProgram}>
        <b>{name.fi}</b>
        {
          isLoading && <div>loading...</div>
        }
        {
          moduleGroups && <div>moduleGroups placeholder: { moduleGroups.length }</div>
        }
      </div>);
  }
}

DegreeProgram.propTypes = {
  academicYear: string.isRequired,
  degreeProgram: degreeProgramType.isRequired
};


export default DegreeProgram;
