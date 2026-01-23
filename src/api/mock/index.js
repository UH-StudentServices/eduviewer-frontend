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
const lvNames = require('./lv_names.json');
const lvs = require('./lvs.json');
const codedEducations = require('./coded_educations.json');
const kh50005 = require('./kh50_005.json');
const kh40006 = require('./kh40_006.json');
const kh40005 = require('./kh40_005.json');

const getJson = (path) => {
  if (path === '/coded_educations') {
    return Promise.resolve(codedEducations);
  }
  if (path === '/lv_names') {
    return Promise.resolve(lvNames);
  }
  if (path.startsWith('/lvs/')) {
    return Promise.resolve(lvs);
  }
  if (path.startsWith('/tree_by_code/')) {
    const code = path.split('/').at(2).split('?').at(0);
    switch (code) {
      case 'KH50_005':
        return Promise.resolve(kh50005);
      case 'KH40_006':
        return Promise.resolve(kh40006);
      case 'KH40_005':
        return Promise.resolve(kh40005);
      default:
        return Promise.reject(new Error(`Unknown code: ${code}`));
    }
  }
  return Promise.reject(new Error(`Unknown path: ${path}`));
};

export default getJson;
