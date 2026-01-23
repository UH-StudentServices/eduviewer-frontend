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

import React, {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  arrayOf, bool, node, number, oneOfType, string
} from 'prop-types';
import classNames from 'classnames';

import { hintsType, oneOfRulesType } from '../../types';
import {
  creditsToString,
  getRuleHints,
  getLangAttribute,
  getNameWithLangCode,
  getPreviousCompositeRuleHints,
  getStudyModuleUrl
} from '../../utils';
import styles from '../RootModule/rootModule.css';
import Link from '../Link';
import OptionContext from '../../context/OptionContext';
import useTranslation from '../../hooks/useTranslation';

const Accordion = ({
  rule,
  hlevel = 3,
  isCompact,
  hints,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef(null);
  const {
    lang,
    academicYear,
    internalLinks,
    showAll
  } = useContext(OptionContext);
  const { t } = useTranslation();

  useEffect(() => {
    accordionRef.current?.setIsExpanded(showAll);
    setIsOpen(showAll);
  }, [showAll]);

  const myCredits = creditsToString(rule.dataNode?.targetCredits, t, true);
  const { code, id, gradeScaleId } = rule.dataNode;
  const ruleHints = getRuleHints(hints);
  const prevCompositeHintGroup = getPreviousCompositeRuleHints(hints, -2);
  const isLink = !!gradeScaleId;
  const isIconButton = isLink || prevCompositeHintGroup?.get('hasStudyModules');
  const [title, titleLangCode] = getNameWithLangCode(rule, lang);
  const titleLang = getLangAttribute(lang, titleLangCode);

  const titlePart = isLink ? (
    <>
      <span>
        {code}&nbsp;
        <Link
          href={getStudyModuleUrl(id, lang, academicYear)}
          external={!internalLinks}
          lang={titleLang}
          dsText={title}
          dsWeight={isCompact ? 'regular' : 'semibold'}
        />
      </span>
      <small className="ds-bodytext-md">{myCredits}</small>
    </>
  ) : (
    <>
      <span lang={titleLang}>{title}</span>
      <small className="ds-bodytext-md">{myCredits}</small>
    </>
  );

  const accordionHeader = isIconButton ? (
    <div className={styles.accordionHeader}>
      <span
        id={`ac-${rule.localId}-title`}
        aria-level={hlevel}
        role="heading"
        className={
          classNames(
            styles.accordionHeaderContent,
            isCompact ? `ds-bodytext-md ${styles.accordionHeaderContentCompact}` : 'ds-bodytext-lg'
          )
        }
      >
        {titlePart}
      </span>
    </div>
  ) : (
    <span className={styles.accordionHeaderContent}>
      {titlePart}
    </span>
  );

  const handleDsToggle = (event) => {
    event.stopPropagation();
    setIsOpen(event.detail);
  };

  return (
    <eduviewer-ds-accordion
      ref={accordionRef}
      className={styles.accordion}
      dsVariant={isCompact ? 'compact' : 'default'}
      dsHeadingLevel={hlevel}
      dsHeadingVariant={isIconButton ? 'icon-button' : 'button'}
      dsContentHasBackground
      dsHideContentBorders
      dsHideLeftBorder={false}
      dsHideRightBorder
      dsHideTopBorder={!!ruleHints?.get('hideAccordionTopBorder')}
      dsHideBottomBorder={false}
      dsAriaLabelledBy={`ac-${rule.localId}-title`}
      ondsToggle={handleDsToggle}
      data-state={isOpen ? 'open' : 'closed'}
    >
      <div slot="header">
        {accordionHeader}
      </div>
      <div slot="content" className="ds-ml-sm">
        {children}
      </div>
    </eduviewer-ds-accordion>
  );
};

Accordion.defaultProps = {
  hlevel: 3,
  isCompact: false,
  hints: []
};

Accordion.propTypes = {
  rule: oneOfRulesType.isRequired,
  hlevel: number,
  isCompact: bool,
  hints: hintsType,
  children: oneOfType([node, arrayOf(node), string]).isRequired
};

export default Accordion;
