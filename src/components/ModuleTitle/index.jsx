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
import {
  bool, number, string, shape
} from 'prop-types';
import Heading from '../Heading';
import Link from '../Link';
import {
  getDegreeProgrammeUrl,
  getStudyModuleUrl,
  isDegreeProgramme
} from '../../utils';

import styles from '../RootModule/rootModule.css';

const ModuleTitle = ({
  name,
  hlevel,
  accordion,
  skipTitle,
  showAsLink,
  moduleCode,
  moduleCredits,
  rule,
  lang,
  academicYear,
  internalLinks
}) => {
  if (name && !accordion && !skipTitle) {
    if (showAsLink) {
      return (
        <Heading
          level={hlevel}
          className={styles.moduleTitle}
          id={`title-${rule.localId}`}
        >
          <Link
            href={
              isDegreeProgramme(rule.dataNode)
                ? getDegreeProgrammeUrl(rule.dataNode.id, lang, academicYear)
                : getStudyModuleUrl(rule.dataNode.id, lang, academicYear)
            }
            external={!internalLinks}
          >
            <span>{moduleCode} </span>
            {name}
          </Link>
          {moduleCredits && (
            <span className={styles.moduleCredits}>{moduleCredits}</span>
          )}
        </Heading>
      );
    }
    return (
      <Heading
        level={hlevel}
        className={styles.moduleTitle}
        id={`title-${rule.localId}`}
      >
        {name}
        {moduleCredits && (
          <span className={styles.moduleCredits}>{moduleCredits}</span>
        )}
      </Heading>
    );
  }
  return null;
};

ModuleTitle.defaultProps = {
  name: '',
  accordion: false,
  skipTitle: false,
  showAsLink: false,
  moduleCode: '',
  moduleCredits: '',
  internalLinks: false
};

ModuleTitle.propTypes = {
  name: string,
  hlevel: number.isRequired,
  accordion: bool,
  skipTitle: bool,
  showAsLink: bool,
  moduleCode: string,
  moduleCredits: string,
  rule: shape({}).isRequired,
  lang: string.isRequired,
  academicYear: string.isRequired,
  internalLinks: bool
};

export default ModuleTitle;
