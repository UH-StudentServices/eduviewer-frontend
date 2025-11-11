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
import { useContext } from 'react';

import translations from '../i18n/translations.json';
import LangContext from '../context/LangContext';
import { DEFAULT_LANG } from '../constants';

/**
 *
 * @param {string} text
 * @param {Object.<string, (string|number|null)>} query
 * @returns
 */
const interpolation = (text, query) =>
  Object.keys(query).reduce((all, key) => {
    const regex = new RegExp(`\\\${\\s*${key}?\\s*}`, 'gm');
    return all.replace(regex, query[key]);
  }, text);

/**
 * @typedef Translate
 * @property {string} key
 * @property {object} [mapping]
 * @property {string} [lang]
 * @returns {string}
 */

/**
 * @typedef I18n
 * @property {Translate} t
 * @property {string} lang
 *
 */

const langIndex = {
  fi: 0,
  sv: 1,
  en: 2
};

/**
 *
 * @returns {I18n}
 */
const useTranslation = () => {
  const langContext = useContext(LangContext);

  /**
   *
   * @param {string} key
   * @param {object} [mapping]
   * @param {string} [lang]
   * @returns {string}
   */
  const t = (key, mapping, lang) => {
    const trimKey = key?.trim() || '';
    if (!translations) {
      return trimKey;
    }
    const myLang = lang || langContext.lang || DEFAULT_LANG;
    const textObject = trimKey.split('.').reduce((translation, keyPart) => translation && translation[keyPart], translations);
    if (textObject !== null && textObject !== undefined) {
      const text = textObject[langIndex[myLang]];
      return mapping && text ? interpolation(text, mapping) : text;
    }
    return trimKey;
  };

  return { t, lang: langContext.lang || DEFAULT_LANG };
};

export default useTranslation;
