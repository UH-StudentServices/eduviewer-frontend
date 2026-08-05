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

import { availableLanguages, DEFAULT_LANG } from '../constants';

const EDUVIEWER_ROOT_ID = 'eduviewer-root';

// Canonical attribute names; read as `data-<name>`, with the bare name as a
// deprecated fallback for host pages that haven't migrated yet.
// Language is intentionally not a config attribute: it uses the standard HTML
// `lang` attribute (on the root element or inherited from an ancestor).
const MODULE_ATTR_NAME = 'module-code';
const ACADEMIC_YEAR_ATTR_NAME = 'academic-year';
const HIDE_SELECTIONS_ATTR_NAME = 'hide-selections';
const HIDE_SELECTED_ACADEMIC_YEAR_ATTR_NAME = 'hide-selected-academic-year';
const SKIP_TITLE_ATTR_NAME = 'skip-title';
const INTERNAL_COURSE_LINK_ATTR_NAME = 'internal-course-links';
// Unknown attribute names starting with "on" are not allowed in React,
// hence this alternative to ONLY_SELECTED_YEAR_ATTR_NAME
const SELECTED_YEAR_ONLY_ATTR_NAME = 'selected-academic-year-only';
const HEADER_ATTR_NAME = 'header';

/**
 * @deprecated use `MODULE_ATTR_NAME` instead — never read with data- prefix
 */
const DEGREE_PROGRAM_ATTR_NAME = 'degree-program-id';
/**
 * @deprecated use `SKIP_TITLE_ATTR_NAME` instead — never read with data- prefix
 */
const HIDE_ACCORDION_ATTR_NAME = 'hide-accordion';
/**
 * @deprecated use `SELECTED_YEAR_ONLY_ATTR_NAME` instead — never read with data- prefix
 */
const ONLY_SELECTED_YEAR_ATTR_NAME = 'only-selected-academic-year';

export const getRoot = () => document.getElementById(EDUVIEWER_ROOT_ID);

/**
 * Reads a config attribute from the root element: `data-<name>` when present,
 * otherwise the bare legacy `<name>`. Presence-based, so an empty-valued
 * data attribute shadows the legacy one.
 *
 * @param {Element|null} root
 * @param {string} name - Canonical attribute name without the data- prefix
 * @returns {string|null}
 */
export const getConfigAttribute = (root, name) => root?.getAttribute(`data-${name}`)
  ?? root?.getAttribute(name)
  ?? null;

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
export const parseBooleanAttribute = (valueString) => valueString !== null && valueString.toLocaleLowerCase() !== 'false';

const SUPPORTED_LANGS = Object.values(availableLanguages);

// BCP 47 language tag → primary subtag, e.g. 'fi-FI' → 'fi'
const normalizeLang = (value) => (value || '').trim().toLowerCase().split('-')[0];

// Nearest ancestor-or-self lang, skipping empty values ("language unknown")
const getInheritedLang = (root) => {
  let element = root?.closest('[lang]');
  while (element) {
    const value = element.getAttribute('lang');
    if (value.trim() !== '') return value;
    element = element.parentElement?.closest('[lang]') ?? null;
  }
  return null;
};

/**
 * Resolves the widget language from the standard HTML `lang` attribute on
 * the root element or its nearest `[lang]` ancestor (typically
 * `<html lang>`) → `DEFAULT_LANG`. Unsupported languages fall back to
 * `DEFAULT_LANG`.
 *
 * @param {Element|null} root
 * @returns {string}
 */
export const resolveLang = (root) => {
  const candidate = normalizeLang(getInheritedLang(root));
  return SUPPORTED_LANGS.includes(candidate) ? candidate : DEFAULT_LANG;
};

/**
 * Reads the whole embed configuration from the root element.
 *
 * @param {Element|null} root
 * @returns {{
 *   code: string,
 *   academicYearCode: string|null,
 *   hideSelections: boolean,
 *   hideSelectedAcademicYear: boolean,
 *   skipTitle: boolean,
 *   internalCourseLink: boolean,
 *   onlySelectedAcademicYear: boolean,
 *   lang: string,
 *   header: string
 * }}
 */
export const readEmbedConfig = (root) => ({
  code: getConfigAttribute(root, MODULE_ATTR_NAME)
    ?? root?.getAttribute(DEGREE_PROGRAM_ATTR_NAME)
    ?? '',
  academicYearCode: getConfigAttribute(root, ACADEMIC_YEAR_ATTR_NAME),
  hideSelections: parseBooleanAttribute(getConfigAttribute(root, HIDE_SELECTIONS_ATTR_NAME)),
  hideSelectedAcademicYear: parseBooleanAttribute(
    getConfigAttribute(root, HIDE_SELECTED_ACADEMIC_YEAR_ATTR_NAME)
  ),
  skipTitle: parseBooleanAttribute(
    getConfigAttribute(root, SKIP_TITLE_ATTR_NAME)
      ?? root?.getAttribute(HIDE_ACCORDION_ATTR_NAME)
      ?? null
  ),
  internalCourseLink: parseBooleanAttribute(
    getConfigAttribute(root, INTERNAL_COURSE_LINK_ATTR_NAME)
  ),
  onlySelectedAcademicYear: parseBooleanAttribute(
    getConfigAttribute(root, SELECTED_YEAR_ONLY_ATTR_NAME)
      ?? root?.getAttribute(ONLY_SELECTED_YEAR_ATTR_NAME)
      ?? null
  ),
  lang: resolveLang(root),
  header: getConfigAttribute(root, HEADER_ATTR_NAME) ?? ''
});
