/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-fronted is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-fronted is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-fronted.  If not, see <http://www.gnu.org/licenses/>.
 */
import fetchIntercept from 'fetch-intercept';
import { DEFAULT_BASE_URL } from '../config';

fetchIntercept.register({
  response: (response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`${response.url} ${response.status}`));
    }

    return response.json();
  }
});

const getJson = path => fetch(`${DEFAULT_BASE_URL}${path}`, {
  headers: {
    Accept: 'application/json'
  }
});

export const getDegreePrograms = () => getJson('/coded_educations');

export const getAcademicYearsByDegreeProgramCode = degreeProgramCode => getJson(`/lvs/${degreeProgramCode}`);

export const getAcademicYearNames = () => getJson('/lv_names');

export const getDegreeProgram = (code, academicYear = '') => getJson(`/tree_by_code/${code}?lv=${academicYear}`);
