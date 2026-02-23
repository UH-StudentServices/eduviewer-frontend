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
  hasCreditRequirement,
  getOrdinalRangeString,
  getOrdinals,
  formatOrdinal,
  numberToLetter,
  sortAndRenderRules
} from './index';
import { ruleTypes } from '../constants';

describe('hasCreditRequirement', () => {
  it('returns true when min=0 and max is truthy', () => {
    const rule = { require: { min: 0, max: 1 }, allMandatory: false };
    expect(hasCreditRequirement(rule)).toBeTruthy();
  });

  it('returns falsy when min=0 and max is null', () => {
    const rule = { require: { min: 0, max: null }, allMandatory: false };
    expect(hasCreditRequirement(rule)).toBeFalsy();
  });

  it('returns falsy when allMandatory is true', () => {
    const rule = { require: { min: 5, max: 10 }, allMandatory: true };
    expect(hasCreditRequirement(rule)).toBeFalsy();
  });

  it('returns truthy when min > 0', () => {
    const rule = { require: { min: 5, max: 10 }, allMandatory: false };
    expect(hasCreditRequirement(rule)).toBeTruthy();
  });

  it('returns falsy when require is undefined', () => {
    const rule = { allMandatory: false };
    expect(hasCreditRequirement(rule)).toBeFalsy();
  });
});

describe('numberToLetter', () => {
  it('converts 1 to A', () => {
    expect(numberToLetter(1)).toBe('A');
  });

  it('converts 26 to Z', () => {
    expect(numberToLetter(26)).toBe('Z');
  });

  it('converts 27 to AA', () => {
    expect(numberToLetter(27)).toBe('AA');
  });

  it('converts 28 to AB', () => {
    expect(numberToLetter(28)).toBe('AB');
  });
});

describe('formatOrdinal', () => {
  it('returns number at even index', () => {
    expect(formatOrdinal(3, 0)).toBe(3);
  });

  it('returns letter at odd index', () => {
    expect(formatOrdinal(1, 1)).toBe('A');
  });

  it('returns number at index 2', () => {
    expect(formatOrdinal(5, 2)).toBe(5);
  });

  it('returns letter at index 3', () => {
    expect(formatOrdinal(2, 3)).toBe('B');
  });
});

describe('getOrdinals', () => {
  it('collects ordinals from nested hints chain', () => {
    const hints = {
      ordinal: 3,
      parent: {
        ordinal: 2,
        parent: {
          ordinal: 1,
          parent: null
        }
      }
    };
    expect(getOrdinals(hints)).toEqual([1, 2, 3]);
  });

  it('skips levels without ordinals', () => {
    const hints = {
      ordinal: 2,
      parent: {
        parent: {
          ordinal: 1,
          parent: null
        }
      }
    };
    expect(getOrdinals(hints)).toEqual([1, 2]);
  });

  it('returns empty array for hints with no ordinals', () => {
    const hints = { parent: null };
    expect(getOrdinals(hints)).toEqual([]);
  });
});

describe('getOrdinalRangeString', () => {
  it('returns empty string when rulesCount is 0', () => {
    expect(getOrdinalRangeString({}, 0)).toBe('');
  });

  it('returns simple range when no parent ordinals', () => {
    const hints = { parent: null };
    expect(getOrdinalRangeString(hints, 3)).toBe('1\u20133');
  });

  it('returns prefixed range when parent has ordinals', () => {
    const hints = {
      ordinal: 2,
      parent: { parent: null }
    };
    // ordinals = [2], ordinalsCount = 1
    // rangeStart = formatOrdinal(1, 1) = 'A'
    // rangeEnd = formatOrdinal(3, 1) = 'C'
    // formattedOrdinals = ['B'] (formatOrdinal(2, 0) = 2... wait)
    // Actually: ordinals = [2], formatOrdinal(2, 0) = 2 (even index, numeric)
    // rangeStart = formatOrdinal(1, 1) = 'A' (odd index, letter)
    // rangeEnd = formatOrdinal(3, 1) = 'C'
    // result = '2A\u20132C'
    expect(getOrdinalRangeString(hints, 3)).toBe('2A\u20132C');
  });
});

describe('sortAndRenderRules', () => {
  it('preserves sorted indices through partition', () => {
    // Rules in mixed order: ModuleRule, then two CourseUnitRules
    const rules = [
      { type: ruleTypes.MODULE_RULE, dataNode: { code: 'MOD1' } },
      { type: ruleTypes.COURSE_UNIT_RULE, dataNode: { code: 'CU-B' } },
      { type: ruleTypes.COURSE_UNIT_RULE, dataNode: { code: 'CU-A' } }
    ];
    const rule = {
      type: ruleTypes.COMPOSITE_RULE,
      rules
    };

    const calls = [];
    const renderRule = (opts) => (r, i) => {
      calls.push({ rule: r, index: i, opts });
      return `rendered-${r.dataNode.code}-${i}`;
    };

    sortAndRenderRules(rule, renderRule);

    // After sort: CU-A (pos 0), CU-B (pos 1), MOD1 (pos 2)
    // All are list items in a CompositeRule
    // Indices should match sorted position, preserved through partition
    const indices = calls.map((c) => c.index);
    const codes = calls.map((c) => c.rule.dataNode.code);

    expect(codes).toEqual(['CU-A', 'CU-B', 'MOD1']);
    expect(indices).toEqual([0, 1, 2]);
  });

  it('separates list items from other content', () => {
    const rules = [
      { type: ruleTypes.COURSE_UNIT_RULE, dataNode: { code: 'CU1' } },
      { type: ruleTypes.CREDITS_RULE, dataNode: { code: 'CR1' } }
    ];
    const rule = {
      type: ruleTypes.COMPOSITE_RULE,
      rules
    };

    const renderRule = (opts) => (r, i) => ({
      code: r.dataNode.code,
      index: i,
      isListItem: !!opts?.isListItem
    });

    const [listContent, otherContent] = sortAndRenderRules(rule, renderRule);

    expect(listContent).toHaveLength(1);
    expect(listContent[0].code).toBe('CU1');
    expect(listContent[0].isListItem).toBe(true);

    expect(otherContent).toHaveLength(1);
    expect(otherContent[0].code).toBe('CR1');
    expect(otherContent[0].isListItem).toBe(false);
  });
});
