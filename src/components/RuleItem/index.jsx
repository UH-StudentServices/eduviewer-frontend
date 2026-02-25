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

import React, { Fragment } from 'react';
import {
  bool, shape, number
} from 'prop-types';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import { hintType } from '../../types';

const RuleItem = ({
  rule, hlevel, parent, index, isListItem
}) => {
  const Tag = isListItem ? 'li' : Fragment;
  return (
    <Tag key={rule.localId}>
      <Rule
        key={rule.localId}
        rule={rule}
        hlevel={hlevel}
        parent={parent}
        index={index}
      />
    </Tag>
  );
};

RuleItem.defaultProps = {
  isListItem: false
};

RuleItem.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  parent: hintType.isRequired,
  index: number.isRequired,
  isListItem: bool
};

export default RuleItem;
