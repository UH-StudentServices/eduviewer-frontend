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
/**
 * @deprecated use `MODULE_ATTR_NAME` instead
 */
const DEGREE_PROGRAM_ATTR_NAME = 'degree-program-id';
const MODULE_ATTR_NAME = 'module-code';
const ACADEMIC_YEAR_ATTR_NAME = 'academic-year';
const HIDE_SELECTIONS_ATTR_NAME = 'hide-selections';
const HIDE_SELECTED_ACADEMIC_YEAR_ATTR_NAME = 'hide-selected-academic-year';
/**
 * @deprecated use `SKIP_TITLE_ATTR_NAME` instead
 */
const HIDE_ACCORDION_ATTR_NAME = 'hide-accordion';
const SKIP_TITLE_ATTR_NAME = 'skip-title';
const INTERNAL_COURSE_LINK_ATTR_NAME = 'internal-course-links';
/**
 * @deprecated use `SELECTED_YEAR__ONLY_ATTR_NAME` instead
 */
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

/**
 * Parses a string attribute value to boolean.
 *
 * Any value other than `null` or `'false'` (case insensitive) is considered true.
 *
 * @example
 * parseBooleanAttribute(null) => false
 * parseBooleanAttribute('false') => false
 * parseBooleanAttribute('FALSE') => false
 * parseBooleanAttribute('true') => true
 * parseBooleanAttribute('anything else') => true
 *
 * @param {*} valueString - The attribute value as string
 * @returns {boolean}
 */
const parseBooleanAttribute = (valueString) => valueString !== null && valueString.toLocaleLowerCase() !== 'false';

// eslint-disable-next-line import/prefer-default-export
export const render = () => {
  const code = getRootAttribute(MODULE_ATTR_NAME) || getRootAttribute(DEGREE_PROGRAM_ATTR_NAME) || '';
  const academicYearCode = getRootAttribute(ACADEMIC_YEAR_ATTR_NAME) || calculateCurrentLV();
  const hideSelectionsString = getRootAttribute(HIDE_SELECTIONS_ATTR_NAME);
  const hideSelections = parseBooleanAttribute(hideSelectionsString);
  const hideSelectedAcademicYearString = getRootAttribute(HIDE_SELECTED_ACADEMIC_YEAR_ATTR_NAME);
  const hideSelectedAcademicYear = parseBooleanAttribute(hideSelectedAcademicYearString);
  const skipTitleString = getRootAttribute(SKIP_TITLE_ATTR_NAME)
    || getRootAttribute(HIDE_ACCORDION_ATTR_NAME);
  const skipTitle = parseBooleanAttribute(skipTitleString);
  const internalCourseLinkString = getRootAttribute(INTERNAL_COURSE_LINK_ATTR_NAME);
  const internalCourseLink = parseBooleanAttribute(internalCourseLinkString);
  const onlySelectedAcademicYearString = getRootAttribute(SELECTED_YEAR__ONLY_ATTR_NAME)
    || getRootAttribute(ONLY_SELECTED_YEAR_ATTR_NAME);
  const showOnlySelectedAcademicYear = parseBooleanAttribute(onlySelectedAcademicYearString);
  const lang = getRootAttribute(LANGUAGE_ATTR_NAME) || availableLanguages.FI;
  const header = getRootAttribute(HEADER_ATTR_NAME) || '';
  createRoot(getRoot()).render(
    <LangContextProvider>
      <InitializeLang currentLang={lang}>
        <Main
          code={code}
          academicYearCode={academicYearCode}
          hideSelections={hideSelections}
          skipTitle={skipTitle}
          internalCourseLink={internalCourseLink}
          onlySelectedAcademicYear={showOnlySelectedAcademicYear}
          hideSelectedAcademicYear={hideSelectedAcademicYear}
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
