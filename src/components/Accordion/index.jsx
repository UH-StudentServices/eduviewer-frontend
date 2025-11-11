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

import React, { useContext, useState } from 'react';
import {
  arrayOf, bool, node, number, oneOfType, string
} from 'prop-types';

import { oneOfRulesType } from '../../types';
import {
  ariaLabelForTitle,
  creditsToString,
  getName,
  getStudyModuleUrl
} from '../../utils';
import styles from '../RootModule/rootModule.css';
import Heading from '../Heading';
import Link from '../Link';
import OptionContext from '../../context/OptionContext';
import useTranslation from '../../hooks/useTranslation';

const Accordion = ({
  rule,
  internalAccordion,
  startOpen,
  hlevel = 3,
  children
}) => {
  const [open, setOpen] = useState(startOpen);
  const { lang, academicYear, internalLinks } = useContext(OptionContext);
  const { t } = useTranslation();
  const title = getName(rule, lang);
  const myCredits = creditsToString(rule.dataNode?.targetCredits, t);
  const { code, id, gradeScaleId } = rule.dataNode;
  const showAsLink = !!gradeScaleId;
  const titlePart = showAsLink ? (
    <Link
      href={getStudyModuleUrl(id, lang, academicYear)}
      external={!internalLinks}
      ariaLabel={ariaLabelForTitle(code, title, myCredits)}
    >
      <div className={styles.accordionNameParts}>{code}&nbsp;
        <span className={styles.accordionName}>{title}</span>
        <div>{myCredits}</div>
      </div>
    </Link>
  ) : (
    <div className={styles.accordionNameParts}>
      <span className={styles.accordionName}>{title}</span>
      <div>{myCredits}</div>
    </div>
  );

  return (
    <div className={internalAccordion
      ? styles.internalAccordionContainer : styles.accordionContainer}
    >
      <Heading level={hlevel} className={styles.accordionTitle}>
        <button
          type="button"
          id={`ac-${rule.localId}`}
          className="button--action theme-transparent"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`region-${rule.localId}`}
        >
          <div className={styles.titleRow}>
            {titlePart}
            <span className={`${styles.caretIcon} ${open ? 'icon--caret-up' : 'icon--caret-down'}`} />
          </div>
        </button>
      </Heading>
      <div
        role="region"
        id={`region-${rule.localId}`}
        aria-labelledby={`ac-${rule.localId}`}
        hidden={!open}
        className={styles.accordionRegion}
      >
        {open && children}
      </div>
    </div>
  );
};

Accordion.defaultProps = {
  internalAccordion: false,
  startOpen: false,
  hlevel: 3
};

Accordion.propTypes = {
  rule: oneOfRulesType.isRequired,
  internalAccordion: bool,
  startOpen: bool,
  hlevel: number,
  children: oneOfType([node, arrayOf(node), string]).isRequired
};

export default Accordion;
