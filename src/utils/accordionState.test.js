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

import {
  loadStudyTrackSelections,
  saveStudyTrackSelections
} from './accordionState';

const BACK_PARAM = 'eduviewer-return';
const MODULE_CODE = 'KH40_005';
const ACADEMIC_YEAR = 'hy-lv-76';

const setBackParam = (value) => {
  const url = new URL(globalThis.location.href);
  if (value === null) {
    url.searchParams.delete(BACK_PARAM);
  } else {
    url.searchParams.set(BACK_PARAM, value);
  }
  globalThis.history.replaceState(null, '', url);
};

describe('study-track selection persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
    setBackParam(null);
  });

  it('saveStudyTrackSelections writes JSON under a code+year-scoped key', () => {
    saveStudyTrackSelections(MODULE_CODE, ACADEMIC_YEAR, { wrapperA: 'trackB' });
    expect(sessionStorage.getItem(`eduviewer:dropdown:${MODULE_CODE}:${ACADEMIC_YEAR}`))
      .toBe(JSON.stringify({ wrapperA: 'trackB' }));
  });

  it('loadStudyTrackSelections returns {} when the back-param is absent or scoped to a different module', () => {
    saveStudyTrackSelections(MODULE_CODE, ACADEMIC_YEAR, { wrapperA: 'trackB' });

    // Fresh visit — no back-param at all.
    expect(loadStudyTrackSelections(MODULE_CODE, ACADEMIC_YEAR)).toEqual({});

    // Returning to a different module — the param exists but doesn't match.
    setBackParam('KH50_001');
    expect(loadStudyTrackSelections(MODULE_CODE, ACADEMIC_YEAR)).toEqual({});
  });

  it('loadStudyTrackSelections returns the saved selections when the back-param matches the module', () => {
    saveStudyTrackSelections(MODULE_CODE, ACADEMIC_YEAR, { wrapperA: 'trackB' });
    setBackParam(MODULE_CODE);
    expect(loadStudyTrackSelections(MODULE_CODE, ACADEMIC_YEAR))
      .toEqual({ wrapperA: 'trackB' });
  });
});
