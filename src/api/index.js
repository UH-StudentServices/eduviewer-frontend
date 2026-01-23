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

import { DEFAULT_BASE_URL, env } from '../config';
import mockGetJson from './mock';

const getJson = env.USE_MOCKS
  ? mockGetJson
  : (path) => fetch(`${DEFAULT_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json'
    }
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`${response.url} ${response.status}`);
    }
    return response.json();
  });

export const getEducations = () => getJson('/coded_educations');

export const getAcademicYearsByCode = (code) => getJson(`/lvs/${code}`);

export const getAcademicYearNames = () => getJson('/lv_names');

export const getModuleHierarchy = (code, academicYear = '') => getJson(`/tree_by_code/${code}?lv=${academicYear}`);
