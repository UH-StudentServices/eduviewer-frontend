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
  bool, number, string, shape,
  oneOf
} from 'prop-types';

import Heading from '../Heading';
import Link from '../Link';
import {
  getRuleHints,
  getDegreeProgrammeUrl,
  getLangAttribute,
  getStudyModuleUrl
} from '../../utils';
import styles from '../RootModule/rootModule.css';
import { hintsType } from '../../types';

const ModuleTitle = ({
  hints,
  name,
  nameLangCode,
  hlevel,
  showAsLink,
  moduleCode,
  moduleCredits,
  rule,
  lang,
  academicYear,
  internalLinks
}) => {
  const ruleHints = getRuleHints(hints);
  const nameLang = getLangAttribute(lang, nameLangCode);

  if (!name) {
    return null;
  }

  if (showAsLink) {
    return (
      <Heading
        level={hlevel}
        id={`title-${rule.localId}`}
        className={`${styles.moduleTitle} ${styles.borderLeft} ds-px-sm ds-pt-xs ds-pb-sm`}
      >
        <Link
          href={ruleHints.get('isDegreeProgramme')
            ? getDegreeProgrammeUrl(rule.dataNode.id, lang, academicYear)
            : getStudyModuleUrl(rule.dataNode.id, lang, academicYear)}
          external={!internalLinks}
          lang={nameLang}
          dsText={name}
          dsWeight="semibold"
        >
          <span slot="prefix">{moduleCode}&nbsp;</span>
        </Link>
        {moduleCredits
          && <span className={styles.moduleCredits}>{moduleCredits}</span>}
      </Heading>
    );
  }

  return (
    <Heading
      level={hlevel}
      id={`title-${rule.localId}`}
      className={`${styles.moduleTitle} ${styles.borderLeft} ds-px-sm ds-pb-sm`}
    >
      <span lang={nameLang}>
        {name}
      </span>
      {moduleCredits
        && <span className={styles.moduleCredits}>{moduleCredits}</span>}
    </Heading>
  );
};

ModuleTitle.defaultProps = {
  showAsLink: false,
  moduleCode: '',
  moduleCredits: '',
  internalLinks: false
};

ModuleTitle.propTypes = {
  hints: hintsType.isRequired,
  name: string.isRequired,
  nameLangCode: oneOf(['fi', 'sv', 'en', undefined]).isRequired,
  hlevel: number.isRequired,
  showAsLink: bool,
  moduleCode: string,
  moduleCredits: string,
  rule: shape({}).isRequired,
  lang: string.isRequired,
  academicYear: string.isRequired,
  internalLinks: bool
};

export default ModuleTitle;
