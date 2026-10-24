import _ from 'lodash';
import { Project, Scan } from '../components';

export const saveProjectHandler = (
  currentScan: Scan,
  currentProject: Project,
  updateProjectList: () => void
) => async (
  currentEnumeration: {
    uuid: any;
    severity: any;
    triage: any;
    notes: any;
  },
  { severity, triage, notes }: any
) => {
  const currentEnumerationOriginal = _.find(currentScan?.issues, [
    'uuid',
    currentEnumeration.uuid,
  ]);

  const severityLowercase = severity?.toLowerCase();

  const severityOptions = {
    high: { value: 3, name: 'HIGH' },
    medium: { value: 2, name: 'MEDIUM' },
    low: { value: 1, name: 'LOW' },
    informational: {
      value: 0,
      name: 'INFORMATIONAL',
    },
  };

  if (_.includes(_.keys(severityOptions), severityLowercase)) {
    // Update currently displayed enumeration
    currentEnumeration.severity = severityLowercase;

    // Update original enumeration object
    currentEnumerationOriginal.severity =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      severityOptions[severityLowercase];
  }

  if (!_.isNil(triage)) {
    // Update currently displayed enumeration
    currentEnumeration.triaged = triage;

    // Update original enumeration object
    currentEnumerationOriginal.triaged = triage;
  }

  if (notes) {
    // Update currently displayed enumeration
    currentEnumeration.notes = notes;

    // Update original enumeration object
    currentEnumerationOriginal.notes = notes;
  }

  await currentProject?.save(currentScan.id);
  updateProjectList();
};
