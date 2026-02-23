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

import { getHints } from './index';
import { ruleTypes } from '../../constants';

const makeParent = (overrides = {}) => ({
  ruleType: '',
  rulesCount: 0,
  parent: null,
  ...overrides
});

describe('getHints', () => {
  describe('requireMin', () => {
    it('is set to 0 when require.min=0, require.max is truthy, and rules.length > 1', () => {
      const parent = makeParent();
      const rule = {
        type: ruleTypes.COMPOSITE_RULE,
        rules: [
          { type: ruleTypes.COURSE_UNIT_RULE },
          { type: ruleTypes.COURSE_UNIT_RULE }
        ],
        require: { min: 0, max: 5 },
        allMandatory: false
      };
      const hints = getHints(parent, rule);
      expect(hints.requireMin).toBe(0);
    });

    it('is set to positive value when require.min > 0 and rules.length > 1', () => {
      const parent = makeParent();
      const rule = {
        type: ruleTypes.COMPOSITE_RULE,
        rules: [
          { type: ruleTypes.COURSE_UNIT_RULE },
          { type: ruleTypes.COURSE_UNIT_RULE }
        ],
        require: { min: 2, max: 5 },
        allMandatory: false
      };
      const hints = getHints(parent, rule);
      expect(hints.requireMin).toBe(2);
    });

    it('is undefined when hasCreditRequirement is false', () => {
      const parent = makeParent();
      const rule = {
        type: ruleTypes.COMPOSITE_RULE,
        rules: [
          { type: ruleTypes.COURSE_UNIT_RULE },
          { type: ruleTypes.COURSE_UNIT_RULE }
        ],
        require: { min: 0, max: null },
        allMandatory: false
      };
      const hints = getHints(parent, rule);
      expect(hints.requireMin).toBeUndefined();
    });

    it('is undefined when rules.length <= 1', () => {
      const parent = makeParent();
      const rule = {
        type: ruleTypes.COMPOSITE_RULE,
        rules: [{ type: ruleTypes.COURSE_UNIT_RULE }],
        require: { min: 2, max: 5 },
        allMandatory: false
      };
      const hints = getHints(parent, rule);
      expect(hints.requireMin).toBeUndefined();
    });
  });

  describe('ordinal', () => {
    it('is set when parent.requireMin is 0 (!= null fix)', () => {
      const parent = makeParent({
        requireMin: 0,
        rulesCount: 3,
        ruleType: ruleTypes.COMPOSITE_RULE
      });
      const rule = {
        type: ruleTypes.MODULE_RULE,
        dataNode: { name: { fi: 'Test' } }
      };
      const hints = getHints(parent, rule, 2);
      expect(hints.ordinal).toBe(3);
    });

    it('is set when parent.requireMin is positive', () => {
      const parent = makeParent({
        requireMin: 2,
        rulesCount: 5,
        ruleType: ruleTypes.COMPOSITE_RULE
      });
      const rule = {
        type: ruleTypes.MODULE_RULE,
        dataNode: { name: { fi: 'Test' } }
      };
      const hints = getHints(parent, rule, 0);
      expect(hints.ordinal).toBe(1);
    });

    it('is undefined when parent.requireMin is undefined', () => {
      const parent = makeParent({
        rulesCount: 3,
        ruleType: ruleTypes.COMPOSITE_RULE
      });
      const rule = {
        type: ruleTypes.MODULE_RULE,
        dataNode: { name: { fi: 'Test' } }
      };
      const hints = getHints(parent, rule, 1);
      expect(hints.ordinal).toBeUndefined();
    });

    it('is undefined when requireMin equals rulesCount', () => {
      const parent = makeParent({
        requireMin: 3,
        rulesCount: 3,
        ruleType: ruleTypes.COMPOSITE_RULE
      });
      const rule = {
        type: ruleTypes.MODULE_RULE,
        dataNode: { name: { fi: 'Test' } }
      };
      const hints = getHints(parent, rule, 0);
      expect(hints.ordinal).toBeUndefined();
    });

    it('is undefined when rulesCount <= 1', () => {
      const parent = makeParent({
        requireMin: 0,
        rulesCount: 1,
        ruleType: ruleTypes.COMPOSITE_RULE
      });
      const rule = {
        type: ruleTypes.MODULE_RULE,
        dataNode: { name: { fi: 'Test' } }
      };
      const hints = getHints(parent, rule, 0);
      expect(hints.ordinal).toBeUndefined();
    });
  });
});
