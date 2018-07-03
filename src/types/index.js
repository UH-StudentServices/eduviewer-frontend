import {
  arrayOf, shape, bool, string, number, oneOfType
} from 'prop-types';

export const localizedTextType = shape({
  en: string,
  fi: string.isRequired,
  sv: string
});

export const creditsType = shape({
  max: number,
  min: number.isRequired
});

export const ruleType = shape({
  allMandatory: bool,
  description: localizedTextType,
  localId: string.isRequired,
  require: shape({
    min: number.isRequired,
    max: number
  }),
  rules: arrayOf(shape({
    localId: string.isRequired,
    moduleGroupId: string
  })).isRequired,
  type: string.isRequired
});

export const elemType = shape({
  code: string,
  curriculumPeriodIds: arrayOf(string).isRequired,
  documentState: string.isRequired,
  groupId: string.isRequired,
  id: string.isRequired,
  metadata: shape({
    createdBy: string.isRequired,
    createdOn: string.isRequired,
    lastModifiedBy: string.isRequired,
    lastModifiedOn: string.isRequired,
    modificationOrdinal: number.isRequired,
    revision: number.isRequired
  }).isRequired,
  moduleContentApprovalRequired: bool.isRequired,
  name: localizedTextType,
  rule: shape({
    credits: creditsType,
    localId: string.isRequired,
    rule: ruleType,
    type: string.isRequired
  }).isRequired,
  type: string.isRequired,
  universityOrgIds: arrayOf(string).isRequired
});

export const degreeProgramType = shape({
  id: string.isRequired,
  name: localizedTextType,
  rule: ruleType.isRequired
});

export const selectOptionsType = arrayOf(shape({
  id: oneOfType([string, number]).isRequired,
  value: oneOfType([string, number]).isRequired,
  text: string.isRequired
}));
