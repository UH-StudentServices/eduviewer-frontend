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
import { defineCustomElements } from '@uh-design-system/component-library/dist/loader';

const TAG_NAME_PREFIX = 'eduviewer-';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

defineCustomElements(globalThis, {
  transformTagName: (tagName) => `${TAG_NAME_PREFIX}${tagName}`,
  ce: (eventName, opts) => {
    const renamedEvent = eventName.startsWith('ds') ? capitalize(eventName) : eventName;
    return new CustomEvent(renamedEvent, opts);
  }
});

export default TAG_NAME_PREFIX;
