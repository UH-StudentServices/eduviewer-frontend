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

import { DEFAULT_STYLE_URL } from '../../config';

export const loadStyle = (source) => {
  const headTag = document.getElementsByTagName('head')[0];
  const styleTag = document.createElement('link');
  styleTag.setAttribute('rel', 'stylesheet');
  styleTag.href = source;
  headTag.appendChild(styleTag);

  return new Promise((resolve) => {
    styleTag.onload = resolve;
  });
};

export const loadLocalStyleGuide = () => new Promise((resolve) => {
  document.addEventListener('DOMContentLoaded', () => {
    loadStyle(`${DEFAULT_STYLE_URL}/styles.css`)
      .then(resolve);
  });
});
