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
import React, { useMemo } from 'react';
import {
  element
} from 'prop-types';

import ViewportContext from '.';
import useMediaQuery from '../../hooks/useMediaQuery';

const ViewportContextProvider = ({ children }) => {
  /**
   * Uses DS naming convention for breakpoints
   *
   * @see {@link https://designsystem.helsinki.fi/2de013a32/p/3363c5-grid-and-breakpoints/t/16e7507136}
   */
  const isXSmallOrSmaller = useMediaQuery('(width < 480px)');

  const value = useMemo(() => ({ isXSmallOrSmaller }), [isXSmallOrSmaller]);
  return (
    <ViewportContext.Provider value={value}>
      { children }
    </ViewportContext.Provider>
  );
};

ViewportContextProvider.propTypes = {
  children: element.isRequired
};

export default ViewportContextProvider;
