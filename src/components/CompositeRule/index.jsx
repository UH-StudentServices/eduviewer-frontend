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
  shape, number
} from 'prop-types';
import classNames from 'classnames';

import {
  hasCreditRequirement,
  idGenerator,
  sortAndPartitionRules
} from '../../utils';
// eslint-disable-next-line import/no-cycle
import RuleItem from '../RuleItem';
import OptionContext from '../../context/OptionContext';
import ViewportContext from '../../context/ViewportContext';
import Description from '../Description';
import styles from '../RootModule/rootModule.css';
import { hintType } from '../../types';
import GroupHeader from '../GroupHeader';
import CreditRequirement from '../CreditRequirement';
import useTranslation from '../../hooks/useTranslation';

const ruleGenerator = idGenerator('composite-rule');

const CompositeRule = ({
  rule,
  hlevel,
  hints
}) => {
  const ruleId = ruleGenerator.next().value;
  const { t } = useTranslation();
  const { lang } = useContext(OptionContext);
  const { isXSmallOrSmaller } = useContext(ViewportContext);
  if (!rule) {
    return null;
  }

  const hasCourseUnitsTitle = hints.hasCourseUnits
    && hints.isInStudyModule
    && !hints.parent?.hasCourseUnitHeader;
  const hasTitle = (
    hasCourseUnitsTitle
    || (hints.hasStudyModules && !hints.parent?.hasStudyModuleHeader)
  );
  const titleId = hasTitle ? `${ruleId}-title` : undefined;
  const hasCreditRequirementHeader = hasCreditRequirement(rule);
  const creditRequirementId = hasCreditRequirementHeader ? `${ruleId}-credit-requirement` : undefined;
  const hasGroupHeader = hints.ordinal;
  const groupHeaderId = hasGroupHeader ? `${ruleId}-group-header` : undefined;
  const descriptionId = hints.hasDescription ? `${ruleId}-description` : undefined;

  const childHlevel = hasTitle ? hlevel + 1 : hlevel;
  const [listItems, otherItems] = sortAndPartitionRules(rule);
  const renderItem = (item) => (
    <RuleItem
      key={item.rule.localId}
      rule={item.rule}
      hlevel={childHlevel}
      parent={hints}
      index={item.index}
      isListItem={item.isListItem}
    />
  );
  const listContent = listItems.map(renderItem);
  const otherContent = otherItems.map(renderItem);
  let content = otherContent;

  if (listContent.length) {
    content = [(
      <ul
        key={`ul-${rule.localId}`}
        aria-labelledby={[groupHeaderId, creditRequirementId, titleId].filter(Boolean).join(' ')}
        aria-describedby={descriptionId}
      >
        {listContent}
      </ul>
    ), ...otherContent];
  }

  const renderComponents = () => {
    if (hasCreditRequirementHeader) {
      return (
        <>
          <Description id={descriptionId} rule={rule} lang={lang} hints={hints} />
          <CreditRequirement id={creditRequirementId} rule={rule} hints={hints} />
          <GroupHeader id={groupHeaderId} hints={hints} borderTop borderBottom />
        </>
      );
    }
    if (hasGroupHeader) {
      return (
        <>
          <GroupHeader id={groupHeaderId} hints={hints} borderTop borderBottom />
          <Description id={descriptionId} rule={rule} lang={lang} hints={hints} />
        </>
      );
    }
    return (
      <Description id={descriptionId} rule={rule} lang={lang} hints={hints} />
    );
  };

  return (
    <>
      <div
        className={
          classNames(
            {
              [styles.borderLeft]: hints.isInAccordion,
              [styles.otherContent]: !hasGroupHeader
            }
          )
        }
      >
        {hasTitle && (
          <div
            id={titleId}
            className={
              classNames(
                'ds-heading-xs',
                'ds-pr-sm',
                {
                  'ds-pl-sm': hints.isInAccordion || isXSmallOrSmaller,
                  // Applies negative margins.
                  // Use only when there is no other content; otherwise, render normally.
                  [styles.courseUnitsTitle]: hasCourseUnitsTitle
                    && !hints.hasDescription
                    && !hasCreditRequirementHeader
                    && !hasGroupHeader
                }
              )
            }
            role="heading"
            aria-level={hlevel}
          >
            {hasCourseUnitsTitle ? t('courseUnits') : t('modules')}
          </div>
        )}
        {renderComponents()}
      </div>
      {content}
    </>
  );
};

CompositeRule.propTypes = {
  rule: shape({}).isRequired,
  hlevel: number.isRequired,
  hints: hintType.isRequired
};

export default CompositeRule;
