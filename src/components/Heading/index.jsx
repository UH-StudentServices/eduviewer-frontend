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
import {
  arrayOf, node, number, oneOfType, string
} from 'prop-types';
import styles from '../RootModule/rootModule.css';

const Heading = ({
  id,
  level,
  className,
  ariaLabel,
  children
}) => {
  const hLevel = `h${level}`;
  const limitedHLevel = `h${Math.min(level, 6)}`;
  return React.createElement(
    limitedHLevel,
    { id, className: `${styles[hLevel]} ${className}`, 'aria-label': ariaLabel },
    children
  );
};

Heading.defaultProps = {
  id: undefined,
  ariaLabel: undefined,
  className: ''
};

Heading.propTypes = {
  id: string,
  ariaLabel: string,
  className: string,
  level: number.isRequired,
  children: oneOfType([node, arrayOf(node), string]).isRequired
};

export default Heading;
