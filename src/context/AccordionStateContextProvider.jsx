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
import React, { useCallback, useMemo, useRef } from 'react';
import { element, string } from 'prop-types';

import AccordionStateContext from './AccordionStateContext';
import { loadAccordionState, saveAccordionState } from '../utils/accordionState';

const AccordionStateContextProvider = ({ moduleCode, academicYear, children }) => {
  const openIds = useRef(loadAccordionState(moduleCode, academicYear));
  const saveTimer = useRef(null);
  const pendingRestores = useRef(new Set());
  const restoreListeners = useRef(new Set());

  // Debounce sessionStorage writes. "Open/Close all" triggers dsToggle on every
  // accordion individually, which would cause ~77 synchronous JSON.stringify +
  // sessionStorage.setItem calls in rapid succession. Batching into one write
  // avoids jank on low-end devices while keeping the in-memory Set always current.
  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveAccordionState(moduleCode, academicYear, openIds.current);
    }, 100);
  }, [moduleCode, academicYear]);

  const isAccordionOpen = useCallback(
    (localId) => openIds.current.has(localId),
    []
  );

  const setAccordionOpen = useCallback((localId, isOpen) => {
    if (isOpen) {
      openIds.current.add(localId);
    } else {
      openIds.current.delete(localId);
    }
    scheduleSave();
  }, [scheduleSave]);

  // Restoration tracking: each Accordion that re-expands itself on mount
  // registers its setIsExpanded() promise here. Consumers (e.g. RootModule's
  // scroll restoration) use onRestoreComplete to be notified when the tree
  // has finished re-expanding.
  const registerRestoration = useCallback((promise) => {
    pendingRestores.current.add(promise);
    const done = () => {
      pendingRestores.current.delete(promise);
      if (pendingRestores.current.size === 0) {
        const fns = [...restoreListeners.current];
        restoreListeners.current.clear();
        fns.forEach((fn) => fn());
      }
    };
    promise.then(done, done);
  }, []);

  const onRestoreComplete = useCallback((fn) => {
    if (pendingRestores.current.size === 0) {
      // Defer so fn always fires asynchronously and matches the .then
      // path on registerRestoration() => the caller's unsubscribe/cleanup
      // is in place before fn runs.
      queueMicrotask(fn);
      return () => {};
    }
    restoreListeners.current.add(fn);
    return () => { restoreListeners.current.delete(fn); };
  }, []);

  const value = useMemo(() => ({
    isAccordionOpen,
    setAccordionOpen,
    registerRestoration,
    onRestoreComplete
  }), [isAccordionOpen, setAccordionOpen, registerRestoration, onRestoreComplete]);

  return (
    <AccordionStateContext.Provider value={value}>
      {children}
    </AccordionStateContext.Provider>
  );
};

AccordionStateContextProvider.propTypes = {
  moduleCode: string.isRequired,
  academicYear: string.isRequired,
  children: element.isRequired
};

export default AccordionStateContextProvider;
