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

import React, { useContext, useEffect, useState } from 'react';
import { node, string } from 'prop-types';

import { DEFAULT_LANG } from '../../constants';
import LangContext from '../../context/LangContext';

/**
 * InitializeLang Component
 *
 * @description Initializes language settings
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render after initialization
 * @param {Object} props.config - Configuration object containing language settings
 */
const InitializeLang = ({ children, currentLang }) => {
  const { setLang } = useContext(LangContext);
  const [langInitialized, setLangInitialized] = useState(false);

  const lang = currentLang || DEFAULT_LANG;

  useEffect(() => {
    if (!langInitialized) {
      setLang(lang);
      setLangInitialized(true);
    }
  }, [langInitialized, lang, setLang]);

  if (!langInitialized) {
    return null;
  }

  return (
    <>
      <eduviewer-ds-store dsLanguage={lang} />
      {children}
    </>
  );
};

InitializeLang.propTypes = {
  children: node.isRequired,
  currentLang: string.isRequired
};

export default InitializeLang;
