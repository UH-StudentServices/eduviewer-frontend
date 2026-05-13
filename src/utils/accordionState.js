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

const getStorageKey = (moduleCode, academicYear) => `eduviewer:accordion:${moduleCode}:${academicYear}`;
const getScrollKey = (moduleCode, academicYear) => `eduviewer:scroll:${moduleCode}:${academicYear}`;
const getDropdownKey = (moduleCode, academicYear) => `eduviewer:dropdown:${moduleCode}:${academicYear}`;
const BACK_PARAM = 'eduviewer-return';

export const saveAccordionState = (moduleCode, academicYear, openIds) => {
  try {
    const key = getStorageKey(moduleCode, academicYear);
    sessionStorage.setItem(key, JSON.stringify([...openIds]));
  } catch {
    // sessionStorage may be unavailable (e.g. private browsing in some browsers)
  }
};

export const loadAccordionState = (moduleCode, academicYear) => {
  try {
    const params = new URLSearchParams(globalThis.location.search);
    if (params.get(BACK_PARAM) !== moduleCode) return new Set();
    const key = getStorageKey(moduleCode, academicYear);
    const stored = sessionStorage.getItem(key);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    // sessionStorage may be unavailable or data corrupted
  }
  return new Set();
};

export const saveScrollTarget = (moduleCode, academicYear, target) => {
  try {
    const key = getScrollKey(moduleCode, academicYear);
    sessionStorage.setItem(key, JSON.stringify(target));
    const url = new URL(globalThis.location.href);
    url.searchParams.set(BACK_PARAM, moduleCode);
    globalThis.history.replaceState(null, '', url);
  } catch {
    // sessionStorage may be unavailable
  }
};

export const loadScrollTarget = (moduleCode, academicYear) => {
  try {
    const params = new URLSearchParams(globalThis.location.search);
    if (params.get(BACK_PARAM) !== moduleCode) return null;
    const key = getScrollKey(moduleCode, academicYear);
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const loadStudyTrackSelections = (moduleCode, academicYear) => {
  try {
    const params = new URLSearchParams(globalThis.location.search);
    if (params.get(BACK_PARAM) !== moduleCode) return {};
    const stored = sessionStorage.getItem(getDropdownKey(moduleCode, academicYear));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // sessionStorage may be unavailable or data corrupted
  }
  return {};
};

export const saveStudyTrackSelections = (moduleCode, academicYear, selections) => {
  try {
    const key = getDropdownKey(moduleCode, academicYear);
    sessionStorage.setItem(key, JSON.stringify(selections));
  } catch {
    // sessionStorage may be unavailable
  }
};

export const clearScrollTarget = (moduleCode, academicYear) => {
  try {
    const key = getScrollKey(moduleCode, academicYear);
    sessionStorage.removeItem(key);
    const url = new URL(globalThis.location.href);
    url.searchParams.delete(BACK_PARAM);
    globalThis.history.replaceState(null, '', url);
  } catch {
    // sessionStorage may be unavailable
  }
};
