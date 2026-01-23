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
import { func, bool } from 'prop-types';

import styles from '../Main/main.css';
import useTranslation from '../../hooks/useTranslation';

const ToggleAllButton = ({ onChange, showAll }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.toggleAllButton}>
      <eduviewer-ds-button
        dsVariant="supplementary"
        dsText={t(showAll ? 'closeStructure' : 'openStructure')}
        dsIcon={showAll ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
        dsAriaPressed={showAll}
        onClick={onChange}
      />
    </div>
  );
};

ToggleAllButton.propTypes = {
  onChange: func.isRequired,
  showAll: bool.isRequired
};

export default ToggleAllButton;
