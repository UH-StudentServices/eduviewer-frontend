/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-fronted is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-fronted is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-fronted.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { string, bool } from 'prop-types';

import styles from './infoBox.css';

const InfoBox = ({ content, setInnerHtml }) => (
  <div className={styles.infoContainer}>
    <span className={`${styles.iconContainer} icon--info`} />
    {setInnerHtml
      // eslint-disable-next-line react/no-danger
      ? <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
      : <div className={styles.content}>{content}</div>
    }
  </div>
);

InfoBox.propTypes = {
  content: string.isRequired,
  setInnerHtml: bool
};

InfoBox.defaultProps = {
  setInnerHtml: false
};

export default InfoBox;
