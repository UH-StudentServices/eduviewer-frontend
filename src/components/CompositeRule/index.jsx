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

import React, { useContext } from 'react';
import {
  func, bool, shape, number, string
} from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import {
  getDescription, renderRequiredCourseAmount, sortAndRenderRules
} from '../../utils';
// eslint-disable-next-line import/no-cycle
import Rule from '../Rule';
import OptionContext from '../../context/OptionContext';

const CompositeRule = ({
  rule,
  insideAccordion,
  hlevel,
  closestTitleId,
  translate: t
}) => {
  const { lang } = useContext(OptionContext);
  if (!rule) {
    return null;
  }
  const renderRule = (r) => (
    <Rule
      key={r.localId}
      rule={r}
      translate={t}
      insideAccordion={insideAccordion}
      hlevel={hlevel}
      closestTitleId={closestTitleId}
    />
  );
  const [listContent, otherContent] = sortAndRenderRules(rule.rules, renderRule);
  const description = getDescription(rule, lang);
  let content = otherContent;

  if (listContent.length) {
    content = [(
      // eslint-disable-next-line jsx-a11y/no-redundant-roles
      <ul
        key={`ul-${rule.localId}`}
        aria-labelledby={closestTitleId}
        aria-describedby={description ? `desc-${rule.localId}` : undefined}
        role="list"
      >
        {listContent}
      </ul>
    ), ...otherContent];
  }
  return (
    <>
      {renderRequiredCourseAmount(rule, t)}
      {description}
      {content}
    </>
  );
};

CompositeRule.defaultProps = {
  insideAccordion: false
};

CompositeRule.propTypes = {
  rule: shape({}).isRequired,
  translate: func.isRequired,
  hlevel: number.isRequired,
  closestTitleId: string.isRequired,
  insideAccordion: bool
};

export default withLocalize(CompositeRule);
