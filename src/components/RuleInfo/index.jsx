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
  node,
  shape,
  string
} from 'prop-types';
import styles from '../RootModule/rootModule.css';
import Description from '../Description';
import CreditRequirement from '../CreditRequirement';
import { ruleTypes } from '../../constants';
import { getRules } from '../../utils';
import useTranslation from '../../hooks/useTranslation';

const RuleInfo = ({
  rule,
  lang,
  content
}) => {
  const { t } = useTranslation();
  const { require } = rule;
  const rules = getRules(rule);

  let titleTranslationId = 'oneOfFollowing';

  if (rules.every((r) => r.type === ruleTypes.MODULE_RULE)) {
    titleTranslationId = 'oneOfFollowingModules';
  } else if (rules.some((r) => r.type === ruleTypes.COURSE_UNIT_RULE)) {
    titleTranslationId = 'oneOfFollowingCourses';
  }

  if (require?.min === 1 && require?.max === 1) {
    return (
      <>
        <Description rule={rule} lang={lang} />
        <div className={styles.oneOfFollowing}>
          <div className={styles.oneOfFollowingTitle}>{t(titleTranslationId)}</div>
          <div className={styles.oneOfFollowingContent}>
            {content}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CreditRequirement rule={rule} />
      <Description rule={rule} lang={lang} />
      {content}
    </>
  );
};

RuleInfo.propTypes = {
  rule: shape({}).isRequired,
  lang: string.isRequired,
  content: node.isRequired
};

export default RuleInfo;
