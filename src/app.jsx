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

import './sentry';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './register-components';
import { initializeTracker } from './tracking';
import Main from './components/Main';

import './styles';
import { availableLanguages } from './constants';
import { calculateCurrentLV } from './utils';
import LangContextProvider from './context/LangContext/LangContextProvider';
import InitializeLang from './components/InititializeLang';

const EDUVIEWER_ROOT_ID = 'eduviewer-root';
const LANGUAGE_ATTR_NAME = 'lang';
// this is deprecated but supported for legacy reasons, same as module-code but meaning has changed
const DEGREE_PROGRAM_ATTR_NAME = 'degree-program-id';
const MODULE_ATTR_NAME = 'module-code';
const ACADEMIC_YEAR_ATTR_NAME = 'academic-year';
const HIDE_SELECTIONS = 'hide-selections';
const HIDE_ACCORDION = 'hide-accordion';
const INTERNAL_COURSE_LINK = 'internal-course-links';
const ONLY_SELECTED_YEAR_ATTR_NAME = 'only-selected-academic-year';
// Alternate value for ONLY_SELECTED_YEAR_ATTR_NAME for use with React
// Unknown values starting with "on" are not allowed in React
const SELECTED_YEAR__ONLY_ATTR_NAME = 'selected-academic-year-only';
const HEADER_ATTR_NAME = 'header';

const getRoot = () => document.getElementById(EDUVIEWER_ROOT_ID);
const getRootAttribute = (attributeName) => {
  const root = getRoot();
  return root ? root.getAttribute(attributeName) : null;
};

// eslint-disable-next-line import/prefer-default-export
export const render = () => {
  const code = getRootAttribute(DEGREE_PROGRAM_ATTR_NAME) || getRootAttribute(MODULE_ATTR_NAME) || '';
  const academicYearCode = getRootAttribute(ACADEMIC_YEAR_ATTR_NAME) || calculateCurrentLV();
  const hideSelectionsString = getRootAttribute(HIDE_SELECTIONS);
  const hideSelections = hideSelectionsString !== null && hideSelectionsString.toLocaleLowerCase() !== 'false';
  const hideAccordionString = getRootAttribute(HIDE_ACCORDION);
  const hideAccordion = hideAccordionString !== null && hideAccordionString.toLocaleLowerCase() !== 'false';
  const internalCourseLinkString = getRootAttribute(INTERNAL_COURSE_LINK);
  const internalCourseLink = internalCourseLinkString !== null && internalCourseLinkString.toLocaleLowerCase() !== 'false';
  const onlySelectedAYValue = getRootAttribute(ONLY_SELECTED_YEAR_ATTR_NAME)
    || getRootAttribute(SELECTED_YEAR__ONLY_ATTR_NAME);
  const showOnlySelectedAcademicYear = onlySelectedAYValue !== null && onlySelectedAYValue.toLowerCase() !== 'false';
  const lang = getRootAttribute(LANGUAGE_ATTR_NAME) || availableLanguages.FI;
  const header = getRootAttribute(HEADER_ATTR_NAME) || '';
  createRoot(getRoot()).render(
    <LangContextProvider>
      <InitializeLang currentLang={lang}>
        <Main
          code={code}
          academicYearCode={academicYearCode}
          hideSelections={hideSelections}
          hideAccordion={hideAccordion}
          internalCourseLink={internalCourseLink}
          onlySelectedAcademicYear={showOnlySelectedAcademicYear}
          lang={lang}
          header={header}
        />
      </InitializeLang>
    </LangContextProvider>
  );
};

const initializeApp = () => {
  initializeTracker();
  render();
};

if (module.hot) {
  module.hot.accept('./components/Main', () => {
    render();
  });
}

initializeApp();
