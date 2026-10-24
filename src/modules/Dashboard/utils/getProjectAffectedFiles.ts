import * as _ from 'lodash';
import { ProjectAffectedFiles } from '../components/interfaces/ProjectAffectedFiles';
import { Project, Scan } from '../components/interfaces';
import { formatDate } from '../../../utils/formatDate';
import { DateFormats } from '../../../constants/DateFormats';
import { getTopAffectedFiles } from './getTopAffectedFiles';

export const getProjectAffectedFiles = (
  project: Project | undefined
): Array<ProjectAffectedFiles> => {
  return _.reduce(
    project?.scans,
    (acc: Array<ProjectAffectedFiles>, scan: Scan) => {
      _.forEach(getTopAffectedFiles(scan.issues), ({ counter, title }) =>
        acc.push({
          scanTime: formatDate(scan.startTime as Date, DateFormats.dateAndTime),
          occurrences: counter,
          fileName: title,
          rawDateTime: Date.parse(scan.startTime)/1000
        })
      );
      return acc;
    },
    []
  );
};
