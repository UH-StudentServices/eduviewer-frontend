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

import React, { useState } from 'react';
import { bool } from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { activeLanguageType, oneOfRulesType } from '../../types';
import GroupingModule from '../GroupingModule'; // eslint-disable-line
import { getName } from '../../utils';
import styles from './accordionModule.css';

const AccordionModule = ({ showAll, rule, activeLanguage }) => {
  const [open, setOpen] = useState(false);
  if (showAll) {
    return (
      <div>
        <>
          {rule.dataNode.rules.map((r) => (
            <GroupingModule
              key={r.localId}
              rule={rule}
              showAll={showAll}
              activeLanguage={activeLanguage}
            />
          ))}
        </>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={`button--action theme-transparent ${styles.accordionButton} ${open ? 'icon--caret-up' : 'icon--caret-down'}`}
        onClick={() => setOpen(!open)}
      >
        {getName(rule, activeLanguage.code)}
      </button>
      {open && (
        <GroupingModule
          key={rule.dataNode.rule.localId}
          rule={rule.dataNode.rule}
          showAll={showAll}
          activeLanguage={activeLanguage}
        />
      )}
    </div>
  );
};

AccordionModule.propTypes = {
  rule: oneOfRulesType.isRequired,
  showAll: bool.isRequired,
  activeLanguage: activeLanguageType.isRequired
};

export default withLocalize(AccordionModule);
