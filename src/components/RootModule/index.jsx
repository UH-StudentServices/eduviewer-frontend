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

import React, {
  useCallback, useContext, useEffect, useMemo, useRef
} from 'react';
import {
  bool, number, string
} from 'prop-types';

import { rootModuleType } from '../../types';
import styles from './rootModule.css';
import { ruleTypes } from '../../constants';
import ModuleRule from '../ModuleRule';
import OptionContext from '../../context/OptionContext';
import AccordionStateContext from '../../context/AccordionStateContext';
import AccordionStateContextProvider from '../../context/AccordionStateContextProvider';
import useTranslation from '../../hooks/useTranslation';
import { getHints } from '../Rule';
import { getCode } from '../../utils';
import {
  saveScrollTarget, loadScrollTarget, clearScrollTarget
} from '../../utils/accordionState';

// Scroll restoration: when returning from a sub-module link, restore the
// scroll position to the module the user clicked. We wait for all accordions
// that are restoring themselves on mount to finish expanding (tracked via
// AccordionStateContext.onRestoreComplete) before measuring, so the target
// element's position is stable. Lives inside AccordionStateContextProvider
// so it can consume the context.
const ScrollRestorer = ({ moduleCode, academicYear }) => {
  const { onRestoreComplete } = useContext(AccordionStateContext);

  useEffect(() => {
    const target = loadScrollTarget(moduleCode, academicYear);
    if (!target) return undefined;

    let cancelled = false;
    const unsubscribe = onRestoreComplete(() => {
      if (cancelled) return;
      // One frame after restoration promises resolve lets the web components
      // commit their expanded DOM and the browser lay it out before measuring.
      requestAnimationFrame(() => {
        if (cancelled) return;
        const moduleEl = document.getElementById(target.moduleId);
        if (!moduleEl) {
          clearScrollTarget(moduleCode, academicYear);
          return;
        }
        const linkEl = moduleEl.querySelector(`a[href="${CSS.escape(target.href)}"]`);
        const scrollTarget = linkEl || moduleEl;
        const top = globalThis.scrollY + scrollTarget.getBoundingClientRect().top;
        globalThis.scrollTo({ top, behavior: 'instant' });
        linkEl?.focus({ preventScroll: true });
        clearScrollTarget(moduleCode, academicYear);
      });
    });

    return () => { cancelled = true; unsubscribe(); };
  }, [moduleCode, academicYear, onRestoreComplete]);

  return null;
};

ScrollRestorer.propTypes = {
  moduleCode: string.isRequired,
  academicYear: string.isRequired
};

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

  const moduleCode = getCode(module) || '';
  const clickHandlerRef = useRef(null);
  const rootElRef = useRef(null);

  useEffect(addBorderBottomToLastChild, [module]);

  const rootRef = useCallback((el) => {
    if (rootElRef.current && clickHandlerRef.current) {
      rootElRef.current.removeEventListener('click', clickHandlerRef.current);
    }
    rootElRef.current = el;
    if (!el) return;

    const handleLinkClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const moduleEl = link.closest(`.${styles.moduleRule}`);
      if (moduleEl?.id) {
        saveScrollTarget(moduleCode, academicYear, {
          moduleId: moduleEl.id,
          href: link.getAttribute('href')
        });
      }
    };

    clickHandlerRef.current = handleLinkClick;
    el.addEventListener('click', handleLinkClick);
  }, [moduleCode, academicYear]);

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
      <AccordionStateContextProvider moduleCode={moduleCode} academicYear={academicYear}>
        <div ref={rootRef} className={styles.rootModule}>
          <ModuleRule
            key={rootRule.localId}
            rule={rootRule}
            hlevel={rootLevel}
            skipTitle={skipTitle}
            hints={hints}
          />
        </div>
        {/* Must render AFTER the tree: React runs mount effects in post-order,
            so this effect runs after every Accordion has registered its
            restoration promise with AccordionStateContext. */}
        <ScrollRestorer moduleCode={moduleCode} academicYear={academicYear} />
      </AccordionStateContextProvider>
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
