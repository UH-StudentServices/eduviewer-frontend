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

import {
  getConfigAttribute,
  getRoot,
  parseBooleanAttribute,
  readEmbedConfig,
  resolveLang
} from './rootAttributes';

const createRoot = (attributes = '', { wrapper = '' } = {}) => {
  const rootHtml = `<div id="eduviewer-root" ${attributes}></div>`;
  document.body.innerHTML = wrapper
    ? wrapper.replace('%ROOT%', rootHtml)
    : rootHtml;
  return getRoot();
};

describe('rootAttributes', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('lang');
    document.body.innerHTML = '';
  });

  describe('getConfigAttribute', () => {
    it('prefers data- prefixed attribute over legacy one', () => {
      const root = createRoot('data-module-code="A" module-code="B"');
      expect(getConfigAttribute(root, 'module-code')).toBe('A');
    });

    it('falls back to legacy attribute when data- attribute is absent', () => {
      const root = createRoot('module-code="B"');
      expect(getConfigAttribute(root, 'module-code')).toBe('B');
    });

    it('lets an empty data- attribute shadow the legacy attribute', () => {
      const root = createRoot('data-header="" header="x"');
      expect(getConfigAttribute(root, 'header')).toBe('');
    });

    it('returns null when neither attribute is present', () => {
      const root = createRoot();
      expect(getConfigAttribute(root, 'header')).toBeNull();
    });

    it('returns null for a null root', () => {
      expect(getConfigAttribute(null, 'header')).toBeNull();
    });
  });

  describe('parseBooleanAttribute', () => {
    it.each([
      [null, false],
      ['false', false],
      ['FALSE', false],
      ['', true],
      ['true', true],
      ['anything else', true]
    ])('parses %p as %p', (value, expected) => {
      expect(parseBooleanAttribute(value)).toBe(expected);
    });
  });

  describe('boolean config attributes', () => {
    it('treats a bare data- boolean attribute as true', () => {
      const root = createRoot('data-hide-selections');
      expect(readEmbedConfig(root).hideSelections).toBe(true);
    });

    it('lets a bare data-skip-title win over legacy hide-accordion', () => {
      const root = createRoot('data-skip-title="" hide-accordion="false"');
      expect(readEmbedConfig(root).skipTitle).toBe(true);
    });
  });

  describe('deprecated aliases', () => {
    it('does not read degree-program-id with a data- prefix', () => {
      const root = createRoot('data-degree-program-id="X"');
      expect(readEmbedConfig(root).code).toBe('');
    });

    it('reads legacy degree-program-id as module code fallback', () => {
      const root = createRoot('degree-program-id="X"');
      expect(readEmbedConfig(root).code).toBe('X');
    });

    it('prefers data-module-code over degree-program-id', () => {
      const root = createRoot('data-module-code="A" degree-program-id="X"');
      expect(readEmbedConfig(root).code).toBe('A');
    });

    it('reads legacy hide-accordion as skip-title fallback', () => {
      const root = createRoot('hide-accordion="true"');
      expect(readEmbedConfig(root).skipTitle).toBe(true);
    });

    it('reads legacy only-selected-academic-year as fallback', () => {
      const root = createRoot('only-selected-academic-year="true"');
      expect(readEmbedConfig(root).onlySelectedAcademicYear).toBe(true);
    });

    it('prefers data-selected-academic-year-only over the legacy alias', () => {
      const root = createRoot('data-selected-academic-year-only="false" only-selected-academic-year="true"');
      expect(readEmbedConfig(root).onlySelectedAcademicYear).toBe(false);
    });
  });

  describe('resolveLang', () => {
    it('prefers lang on the root element over inherited lang', () => {
      document.documentElement.setAttribute('lang', 'sv');
      const root = createRoot('lang="en"');
      expect(resolveLang(root)).toBe('en');
    });

    it('inherits from <html lang> when root has no lang', () => {
      document.documentElement.setAttribute('lang', 'sv');
      const root = createRoot();
      expect(resolveLang(root)).toBe('sv');
    });

    it('prefers the nearest [lang] ancestor over <html lang>', () => {
      document.documentElement.setAttribute('lang', 'sv');
      const root = createRoot('', { wrapper: '<div lang="en">%ROOT%</div>' });
      expect(resolveLang(root)).toBe('en');
    });

    it.each([
      ['fi-FI', 'fi'],
      ['EN-us', 'en'],
      ['sv-SE', 'sv']
    ])('normalizes BCP 47 tag %p to %p', (tag, expected) => {
      const root = createRoot(`lang="${tag}"`);
      expect(resolveLang(root)).toBe(expected);
    });

    it('falls back to fi for unsupported languages', () => {
      const root = createRoot('lang="de"');
      expect(resolveLang(root)).toBe('fi');
    });

    it('defaults to fi when no language is set anywhere', () => {
      const root = createRoot();
      expect(resolveLang(root)).toBe('fi');
    });

    it('falls through an empty lang attribute to inherited lang', () => {
      document.documentElement.setAttribute('lang', 'en');
      const root = createRoot('lang=""');
      expect(resolveLang(root)).toBe('en');
    });

    it('ignores data-lang', () => {
      document.documentElement.setAttribute('lang', 'en');
      const root = createRoot('data-lang="sv"');
      expect(resolveLang(root)).toBe('en');
    });
  });

  describe('readEmbedConfig', () => {
    it('returns defaults for a null root without throwing', () => {
      expect(readEmbedConfig(null)).toEqual({
        code: '',
        academicYearCode: null,
        hideSelections: false,
        hideSelectedAcademicYear: false,
        skipTitle: false,
        internalCourseLink: false,
        onlySelectedAcademicYear: false,
        lang: 'fi',
        header: ''
      });
    });

    it('reads a full data- attribute configuration', () => {
      const root = createRoot([
        'data-module-code="KH40_005"',
        'data-academic-year="hy-lv-76"',
        'data-hide-selections="true"',
        'data-hide-selected-academic-year="true"',
        'data-skip-title="true"',
        'data-internal-course-links="true"',
        'data-selected-academic-year-only="true"',
        'lang="en"',
        'data-header="Otsikko"'
      ].join(' '));
      expect(readEmbedConfig(root)).toEqual({
        code: 'KH40_005',
        academicYearCode: 'hy-lv-76',
        hideSelections: true,
        hideSelectedAcademicYear: true,
        skipTitle: true,
        internalCourseLink: true,
        onlySelectedAcademicYear: true,
        lang: 'en',
        header: 'Otsikko'
      });
    });

    it('reads a full legacy attribute configuration', () => {
      const root = createRoot([
        'module-code="KH40_005"',
        'academic-year="hy-lv-76"',
        'hide-selections="true"',
        'skip-title="true"',
        'lang="sv"',
        'header="Rubrik"'
      ].join(' '));
      expect(readEmbedConfig(root)).toEqual(expect.objectContaining({
        code: 'KH40_005',
        academicYearCode: 'hy-lv-76',
        hideSelections: true,
        skipTitle: true,
        lang: 'sv',
        header: 'Rubrik'
      }));
    });
  });
});
