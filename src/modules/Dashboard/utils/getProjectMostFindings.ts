import * as _ from 'lodash';
import { Project, Scan } from '../components/interfaces';
import { formatDate } from '../../../utils/formatDate';
import { DateFormats } from '../../../constants/DateFormats';
import { getMostFindings } from './getMostFindings';
import { ProjectMostFindings } from '../components/interfaces/ProjectMostFindings';

export const getProjectMostFindings = (project: Project | undefined) => {
  return _.reduce(
    project?.scans,
    (acc: Array<ProjectMostFindings>, scan: Scan) => {
      _.forEach(getMostFindings(scan.issues), ({ counter, title }) =>
        acc.push({
          rawDateTime: Date.parse(scan.startTime)/1000,
          scanTime: formatDate(scan.startTime as Date, DateFormats.dateAndTime),
          occurrences: counter,
          findingName: title,
        })
      );
      return acc;
    },
    []
  );
};
