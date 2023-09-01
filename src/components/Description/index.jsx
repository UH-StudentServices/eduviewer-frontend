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
import { shape, string } from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import InfoBox from '../InfoBox';
import { getLocalizedText } from '../../utils';

const Description = ({ rule, lang }) => {
  const { description: ruleDesc, localId } = rule;
  if (ruleDesc) {
    return (
      <InfoBox content={getLocalizedText(ruleDesc, lang)} id={`desc-${localId}`} setInnerHtml />
    );
  }
  return null;
};

Description.propTypes = {
  rule: shape({}).isRequired,
  lang: string.isRequired
};

export default withLocalize(Description);
