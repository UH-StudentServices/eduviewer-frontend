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
  arrayOf, bool, oneOfType, string, node, oneOf
} from 'prop-types';

import styles from '../RootModule/rootModule.css';
import { trackEvent, trackingCategories } from '../../tracking';

const Link = ({
  href, external, lang, children, ariaLabel, dsText, dsVariant, dsWeight
}) => {
  const onNavigate = () => trackEvent(trackingCategories.FOLLOW_LINK, href, ariaLabel);

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      className={styles.link}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener nofollow' : undefined}
      lang={lang}
      onClick={onNavigate}
      onAuxClick={onNavigate}
    >
      <eduviewer-ds-link
        dsTag="span"
        dsColour="black"
        dsWeight={dsWeight}
        dsText={dsText}
        dsVariant={dsVariant}
      >
        {children}
      </eduviewer-ds-link>
    </a>
  );
};

Link.propTypes = {
  href: string.isRequired,
  external: bool,
  lang: oneOf([string, null]),
  children: oneOfType([node, arrayOf(node)]),
  ariaLabel: string,
  dsText: string.isRequired,
  dsVariant: oneOf(['standalone', 'inline']),
  dsWeight: oneOf(['regular', 'semibold'])
};

Link.defaultProps = {
  external: false,
  lang: null,
  ariaLabel: undefined,
  children: null,
  dsVariant: 'inline',
  dsWeight: 'regular'
};

export default Link;
