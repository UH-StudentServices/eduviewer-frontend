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
import { element, string } from 'prop-types';

import AccordionStateContext from './AccordionStateContext';
import OptionContext from './OptionContext';
import {
  loadAccordionState,
  saveAccordionState,
  loadStudyTrackSelections,
  saveStudyTrackSelections
} from '../utils/accordionState';

const SAVE_DEBOUNCE_MS = 100;

// Debounce sessionStorage writes. "Open/Close all" triggers dsToggle on every
// accordion individually, which would cause ~77 synchronous JSON.stringify +
// sessionStorage.setItem calls in rapid succession. Batching into one write
// avoids jank on low-end devices while keeping the in-memory Set always current.
const debouncedSave = (timerRef, save) => {
  clearTimeout(timerRef.current);
  timerRef.current = setTimeout(save, SAVE_DEBOUNCE_MS);
};

const AccordionStateContextProvider = ({ moduleCode, academicYear, children }) => {
  const { showAll } = useContext(OptionContext);
  const openIds = useRef(loadAccordionState(moduleCode, academicYear));
  const studyTrackSelections = useRef(loadStudyTrackSelections(moduleCode, academicYear));
  const accordionSaveTimer = useRef(null);
  const dropdownSaveTimer = useRef(null);
  const pendingRestores = useRef(new Set());
  const restoreListeners = useRef(new Set());
  const prevShowAll = useRef(showAll);

  // "Close all" is a true reset: also wipe stale entries from Study
  // Tracks that aren't currently rendered.
  useEffect(() => {
    if (prevShowAll.current && !showAll) {
      openIds.current.clear();
      saveAccordionState(moduleCode, academicYear, openIds.current);
    }
    prevShowAll.current = showAll;
  }, [showAll, moduleCode, academicYear]);

  const scheduleSave = useCallback(() => {
    debouncedSave(
      accordionSaveTimer,
      () => saveAccordionState(moduleCode, academicYear, openIds.current)
    );
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

  const scheduleDropdownSave = useCallback(() => {
    debouncedSave(
      dropdownSaveTimer,
      () => saveStudyTrackSelections(moduleCode, academicYear, studyTrackSelections.current)
    );
  }, [moduleCode, academicYear]);

  const getStudyTrackSelection = useCallback(
    (localId) => studyTrackSelections.current[localId] ?? null,
    []
  );

  const setStudyTrackSelection = useCallback((localId, value) => {
    if (value) {
      studyTrackSelections.current[localId] = value;
    } else {
      delete studyTrackSelections.current[localId];
    }
    scheduleDropdownSave();
  }, [scheduleDropdownSave]);

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
    onRestoreComplete,
    getStudyTrackSelection,
    setStudyTrackSelection
  }), [
    isAccordionOpen,
    setAccordionOpen,
    registerRestoration,
    onRestoreComplete,
    getStudyTrackSelection,
    setStudyTrackSelection
  ]);

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
