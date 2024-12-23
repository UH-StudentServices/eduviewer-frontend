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
import {
  arrayOf, bool, oneOfType, string, node
} from 'prop-types';
import React from 'react';

import styles from '../RootModule/rootModule.css';
import { trackEvent, trackingCategories } from '../../tracking';

const Link = ({
  href, external, children, ariaLabel
}) => {
  const onNavigate = () => trackEvent(trackingCategories.FOLLOW_LINK, href, ariaLabel);

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      className={styles.link}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener nofollow' : undefined}
      onClick={onNavigate}
      onAuxClick={onNavigate}
    >
      {children}
      { /* NOTE: Agreed with PO to not show external icons. Commented out for now. */ }
      {/* {external && (
        <div className={styles.iconContainer}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
            aria-hidden="true"
          >
            <path d="M993.6,482.3L518.2,6.4
            c-4.6-4.6-11-6.9-17.4-6.3
            c-6.4,0.6-12.3,4-15.9,9.4l-73.5,107.7
            c-5.9,8.6-4.8,20.2,2.6,27.6l265,265.3H21.7
            c-12,0-21.7,9.7-21.7,21.7v128.2
            c0,12,9.7,21.7,21.7,21.7H687L414,855.2
            c-7.4,7.4-8.5,19-2.6,27.6l73.5,107.7
            c3.6,5.3,9.5,8.8,15.9,9.4
            c0.7,0.1,1.3,0.1,2,0.1
            c5.7,0,11.3-2.3,15.4-6.4l475.4-475.9
            c4.8-4.8,6.9-11.4,6.2-17.7
            c0.1-0.8,0.1-1.5,0.1-2.3C1000,491.9,997.7,486.4,993.6,482.3z"
            />
          </svg>
        </div>
      )} */}
    </a>
  );
};

Link.propTypes = {
  href: string.isRequired,
  external: bool,
  children: oneOfType([node, arrayOf(node)]).isRequired,
  ariaLabel: string
};

Link.defaultProps = {
  external: false,
  ariaLabel: undefined
};

export default Link;
