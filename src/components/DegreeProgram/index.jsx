import React from 'react';
import { bool } from 'prop-types';
import { degreeProgramType } from '../../types';

import GroupingModule from '../GroupingModule';

import styles from './degreeProgram.css';

const DegreeProgram = ({ showAll, showContent, degreeProgram }) => {
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
};

DegreeProgram.propTypes = {
  degreeProgram: degreeProgramType.isRequired,
  showAll: bool.isRequired,
  showContent: bool.isRequired
};

export default DegreeProgram;
