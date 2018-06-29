import {
  arrayOf, shape, bool, string, number
} from 'prop-types';

export const ruleType = shape({
  allMandatory: bool.isRequired,
  description: string.isRequired,
  localId: string.isRequired,
  require: shape({
    min: number.isRequired,
    max: number.isRequired
  }).isRequired,
  rules: arrayOf(shape({
    localId: string.isRequired,
    moduleGroupId: string.isRequired
  })).isRequired,
  type: string.isRequired
});

export const creditsType = shape({
  max: number.isRequired,
  min: number.isRequired
});

export const elemType = shape({
  code: string.isRequired,
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
  name: shape({
    en: string.isRequired,
    fi: string.isRequired,
    sv: string.isRequired
  }),
  rule: shape({
    credits: creditsType.isRequired,
    localId: string.isRequired,
    rule: ruleType.isRequired,
    type: string.isRequired
  }).isRequired,
  type: string.isRequired,
  universityOrgIds: arrayOf(string).isRequired
});
