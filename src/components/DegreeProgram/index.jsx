/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-frontend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-frontend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-frontend.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { bool } from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { activeLanguageType, degreeProgramType } from '../../types';

import GroupingModule from '../GroupingModule';

import styles from './degreeProgram.css';
import { getLocalizedText } from '../../utils';

const DegreeProgram = ({
  showAll,
  showContent,
  degreeProgram,
  activeLanguage
}) => {
  if (!showContent) {
    return null;
  }

  const { name, dataNode: { rule } } = degreeProgram;

  return (
    <div className={styles.degreeProgram}>
      <h3 className={styles.degreeProgramTitle}>{getLocalizedText(name, activeLanguage.code)}</h3>
      <div className={styles.moduleGroups}>
        <GroupingModule
          key={rule.localId}
          rule={rule}
          showAll={showAll}
          activeLanguage={activeLanguage}
        />
      </div>
    </div>
  );
};

DegreeProgram.propTypes = {
  degreeProgram: degreeProgramType.isRequired,
  showAll: bool.isRequired,
  showContent: bool.isRequired,
  activeLanguage: activeLanguageType.isRequired
};

export default withLocalize(DegreeProgram);
