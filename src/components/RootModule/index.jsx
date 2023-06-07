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
import { bool, func, number } from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { activeLanguageType, rootModuleType } from '../../types';

import styles from './rootModule.css';
import { ruleTypes } from '../../constants';
import ModuleRule from '../ModuleRule';

const RootModule = ({
  showAll,
  showContent,
  module,
  activeLanguage,
  hideAccordion,
  internalCourseLink,
  rootLevel,
  translate
}) => {
  if (!showContent) {
    return null;
  }
  const rootRule = {
    type: ruleTypes.MODULE_RULE,
    localId: 'rootRule',
    dataNode: module
  };
  return (
    <div className={styles.rootModule}>
      <ModuleRule
        key={rootRule.localId}
        rule={rootRule}
        showAll={showAll}
        translate={translate}
        activeLanguage={activeLanguage}
        internalLinks={internalCourseLink}
        hlevel={rootLevel}
        skipTitle={hideAccordion}
        isDegreeProgramme={module?.type === 'DegreeProgramme'}
      />
    </div>
  );
};

RootModule.defaultProps = {
  rootLevel: 3
};

RootModule.propTypes = {
  module: rootModuleType.isRequired,
  showAll: bool.isRequired,
  showContent: bool.isRequired,
  translate: func.isRequired,
  activeLanguage: activeLanguageType.isRequired,
  hideAccordion: bool.isRequired,
  internalCourseLink: bool.isRequired,
  rootLevel: number
};

export default withLocalize(RootModule);
