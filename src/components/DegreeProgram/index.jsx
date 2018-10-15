import React, { PureComponent } from 'react';
import { bool } from 'prop-types';
import { degreeProgramType } from '../../types';

import GroupingModule from '../GroupingModule';

import styles from './degreeProgram.css';

class DegreeProgram extends PureComponent {
  static propTypes = {
    degreeProgram: degreeProgramType.isRequired,
    showAll: bool.isRequired,
    showContent: bool.isRequired
  };

  render() {
    const { showAll, showContent, degreeProgram } = this.props;

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
