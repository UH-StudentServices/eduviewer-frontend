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
import { shape, string } from 'prop-types';

import styles from '../RootModule/rootModule.css';
import { getLangAttribute, getLocalizedTextWithLangCode } from '../../utils';

const Description = ({
  id,
  rule,
  lang
}) => {
  const { description } = rule;

  if (!description) {
    return null;
  }

  const [content, langCode] = getLocalizedTextWithLangCode(description, lang);
  if (!content) {
    return null;
  }

  return (
    // eslint-disable-next-line react/self-closing-comp
    <div
      id={id}
      className={`${styles.description} ds-bodytext-md ds-px-sm`}
      lang={getLangAttribute(lang, langCode)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: content?.trim() }}
    >
    </div>
  );
};

Description.propTypes = {
  id: string.isRequired,
  rule: shape({}).isRequired,
  lang: string.isRequired
};

export default Description;
