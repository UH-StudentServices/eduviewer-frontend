import React from 'react';
import { string } from 'prop-types';

import CompositeRule from '../CompositeRule'; // eslint-disable-line
import { parseRuleData } from '../utils';
import { elemType, oneOfRulesType } from '../../../types';

const renderCreditsRow = (credits) => {
  const { max, min } = credits;
  const creditsRow = (max == null || min === max) ? `${min} op` : `${min}-${max} op`;

  return <li>Valitse {creditsRow}</li>;
};

const Rule = (props) => {
  const { rule, lv, elem } = props;

  if (rule.type === 'CompositeRule') {
    const rulesData = parseRuleData(rule);
    const { anyMR, anyCUR, creditsRules } = rulesData;
    return (
      <CompositeRule key={rule.id} rule={rule} academicYear={lv} elem={elem}>
        {rulesData.anyMR != null
          && <Rule key={anyMR.localId} rule={anyMR} lv={lv} elem={elem} />}
        {rulesData.anyCUR != null
          && <Rule key={anyCUR.localId} rule={anyCUR} lv={lv} elem={elem} />}
        {rulesData.creditsRules.length > 0
          && <Rule key={creditsRules[0].localId} rule={creditsRules[0]} lv={lv} elem={elem} />}
      </CompositeRule>
    );
  }
  if (rule.type === 'CreditsRule') {
    return (
      <ul>
        {renderCreditsRow(rule.credits)}
        <Rule
          key={rule.rule.localId}
          rule={rule.rule}
          lv={lv}
          elem={elem}
        />
      </ul>
    );
  }
  if (rule.type === 'AnyCourseUnitRule') {
    return <li>Mikä tahansa opintojakso</li>;
  }
  if (rule.type === 'AnyModuleRule') {
    return <li>Mikä tahansa opintokokonaisuus</li>;
  }

  return null;
};

Rule.propTypes = {
  rule: oneOfRulesType.isRequired,
  lv: string.isRequired,
  elem: elemType.isRequired
};

export default Rule;
