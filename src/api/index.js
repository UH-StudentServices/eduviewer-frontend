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

import { DEFAULT_BASE_URL } from '../config';

const getJson = (path) => fetch(`${DEFAULT_BASE_URL}${path}`, {
  headers: {
    Accept: 'application/json'
  }
}).then((response) => {
  if (!response.ok) {
    return Promise.reject(new Error(`${response.url} ${response.status}`));
  }
  return response.json();
});

export const getDegreePrograms = () => getJson('/coded_educations');

export const getAcademicYearsByDegreeProgramCode = (degreeProgramCode) => getJson(`/lvs/${degreeProgramCode}`);

export const getAcademicYearNames = () => getJson('/lv_names');

export const getDegreeProgram = (code, academicYear = '') => getJson(`/tree_by_code/${code}?lv=${academicYear}`);
