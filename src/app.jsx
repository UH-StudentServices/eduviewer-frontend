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
import ReactDOM from 'react-dom';
import { LocalizeProvider } from 'react-localize-redux';
import { initializeTracker } from './tracking';
import Main from './components/Main';

import './styles';
import { availableLanguages } from './constants';
import { loadLocalStyleGuide } from './utils/dependencyLoader';
import { calculateCurrentLV } from './utils';

const EDUVIEWER_ROOT_ID = 'eduviewer-root';
const LANGUAGE_ATTR_NAME = 'lang';
// this is deprecated but supported for legacy reasons, same as module-code but meaning has changed
const DEGREE_PROGRAM_ATTR_NAME = 'degree-program-id';
const MODULE_ATTR_NAME = 'module-code';
const ACADEMIC_YEAR_ATTR_NAME = 'academic-year';
const ONLY_SELECTED_YEAR_ATTR_NAME = 'only-selected-academic-year';
// Alternate value for ONLY_SELECTED_YEAR_ATTR_NAME for use with React
// Unknown values starting with "on" are not allowed in React
const SELECTED_YEAR__ONLY_ATTR_NAME = 'selected-academic-year-only';
const HEADER_ATTR_NAME = 'header';
const DISABLE_GLOBAL_STYLES_ATTR_NAME = 'disable-global-style';

const getRoot = () => document.getElementById(EDUVIEWER_ROOT_ID);
const getRootAttribute = (attributeName) => {
  const root = getRoot();
  return root ? root.getAttribute(attributeName) : null;
};

const render = () => {
  const code = getRootAttribute(DEGREE_PROGRAM_ATTR_NAME) || getRootAttribute(MODULE_ATTR_NAME) || '';
  const academicYearCode = getRootAttribute(ACADEMIC_YEAR_ATTR_NAME) || calculateCurrentLV();
  const onlySelectedAYValue = getRootAttribute(ONLY_SELECTED_YEAR_ATTR_NAME)
    || getRootAttribute(SELECTED_YEAR__ONLY_ATTR_NAME);
  const showOnlySelectedAcademicYear = onlySelectedAYValue !== null && onlySelectedAYValue.toLowerCase() !== 'false';
  const lang = getRootAttribute(LANGUAGE_ATTR_NAME) || availableLanguages.FI;
  const header = getRootAttribute(HEADER_ATTR_NAME) || '';

  ReactDOM.render(
    <>
      <LocalizeProvider>
        <Main
          code={code}
          academicYearCode={academicYearCode}
          onlySelectedAcademicYear={showOnlySelectedAcademicYear}
          lang={lang}
          header={header}
        />
      </LocalizeProvider>
    </>,
    getRoot()
  );
};

const initializeApp = () => {
  initializeTracker();

  const useLocalStyleGuide = getRootAttribute(DISABLE_GLOBAL_STYLES_ATTR_NAME) === null;

  if (useLocalStyleGuide) {
    loadLocalStyleGuide()
      .then(render);
  } else {
    render(Main);
  }
};

if (module.hot) {
  module.hot.accept('./components/Main', () => {
    render();
  });
}

initializeApp();
