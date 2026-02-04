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

import React, { useEffect, useMemo } from 'react';
import {
  bool, number, string
} from 'prop-types';

import { rootModuleType } from '../../types';
import styles from './rootModule.css';
import { ruleTypes } from '../../constants';
import ModuleRule from '../ModuleRule';
import OptionContext from '../../context/OptionContext';
import useTranslation from '../../hooks/useTranslation';
import { getHints } from '../Rule';

const RootModule = ({
  showAll,
  showContent,
  module,
  skipTitle,
  internalCourseLink,
  rootLevel,
  academicYear
}) => {
  const { lang } = useTranslation();
  const options = useMemo(() => ({
    showAll, academicYear, internalLinks: internalCourseLink, lang
  }), [showAll, academicYear, internalCourseLink, lang]);

  /**
   * Adds a border-bottom to the last child element inside the entire structure.
   */
  const addBorderBottomToLastChild = () => {
    const rootModuleElement = document.querySelector(`.${styles.rootModule}`);

    /**
     * Descendant elements that can be the last child
     *
     * NOTE: `DocumentFragment.querySelectorAll` uses depth-first pre-order traversal,
     * so the last element in the returned NodeList will be the last child
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment/querySelectorAll}
     */
    const allElements = rootModuleElement?.querySelectorAll(`.${styles.anyCourse}, .${styles.course}, .${styles.otherContent}`);
    if (allElements?.length > 0) {
      allElements[allElements.length - 1].classList.add(styles.forceBorderBottom);
    }
  };

  useEffect(addBorderBottomToLastChild, [module]);

  if (!showContent) {
    return null;
  }
  const rootRule = {
    type: ruleTypes.MODULE_RULE,
    localId: 'rootRule',
    dataNode: module
  };
  const hints = getHints(null, rootRule, 1);

  return (
    <OptionContext.Provider
      value={options}
    >
      <div className={styles.rootModule}>
        <ModuleRule
          key={rootRule.localId}
          rule={rootRule}
          hlevel={rootLevel}
          skipTitle={skipTitle}
          hints={hints}
        />
      </div>
    </OptionContext.Provider>
  );
};

RootModule.defaultProps = {
  academicYear: ''
};

RootModule.propTypes = {
  module: rootModuleType.isRequired,
  showAll: bool.isRequired,
  showContent: bool.isRequired,
  skipTitle: bool.isRequired,
  internalCourseLink: bool.isRequired,
  rootLevel: number.isRequired,
  academicYear: string
};

export default RootModule;
