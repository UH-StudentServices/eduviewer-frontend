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
import { string, bool } from 'prop-types';

import styles from './infoBox.css';

const InfoBox = ({ content, setInnerHtml, id }) => (
  <div className={styles.infoContainer} id={id}>
    <span className={`${styles.iconContainer} icon--info-stroke`} />
    {
      setInnerHtml
        ? (
          <div
            className={styles.content}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content && content.trim() }}
          />
        )
        : <div className={styles.content}>{content && content.trim()}</div>
    }
  </div>
);

InfoBox.propTypes = {
  content: string.isRequired,
  id: string,
  setInnerHtml: bool
};

InfoBox.defaultProps = {
  setInnerHtml: false,
  id: undefined
};

export default InfoBox;
