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

import React from 'react';
import { func, bool, string } from 'prop-types';

import styles from './toggleSelect.css';

const ToggleSelect = ({ onChange, label, checked }) => (
  <div className={`${styles.toggleContainer} ds-my-md`}>
    <eduviewer-ds-button
      dsVariant="secondary"
      dsText={label}
      dsIcon={checked ? 'visibility_off' : 'visibility'}
      aria-pressed={checked}
      onClick={onChange}
    />
  </div>
);

ToggleSelect.propTypes = {
  onChange: func.isRequired,
  checked: bool.isRequired,
  label: string.isRequired
};

export default ToggleSelect;
