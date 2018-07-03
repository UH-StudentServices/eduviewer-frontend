import { rules } from '../constants';

export const creditsToString = (credits) => {
  const { max, min } = credits;
  return (max === min || max === null) ? min : `${min}–${max}`;
};

const isModuleRule = r => r.type === rules.MODULE_RULE;

export const getModuleGroupIds = rule => (rule.rules
  ? rule.rules.filter(isModuleRule).map(module => module.moduleGroupId)
  : [isModuleRule(rule) && rule.moduleGroupId]);
