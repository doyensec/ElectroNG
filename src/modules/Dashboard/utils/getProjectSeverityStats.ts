import * as _ from 'lodash';
import { Project, Scan } from '../components/interfaces';
import { ProjectSeverityStats } from '../components/interfaces/ProjectSeverityStats';
import { getSeverityStats } from './getSeverityStats';
import { formatDate } from '../../../utils/formatDate';
import { DateFormats } from '../../../constants/DateFormats';

export const getProjectSeverityStats = (
  project: Project | undefined
): Array<ProjectSeverityStats> => {
  return _.reduce(
    project?.scans,
    (acc: Array<ProjectSeverityStats>, scan: Scan) => {
      _.forEach(getSeverityStats(scan.issues), (severityLevel, severityName) =>
        acc.push({
          severityLevel,
          severityName,
          scanTime: formatDate(scan.startTime as Date, DateFormats.dateAndTime),
          rawDateTime: Date.parse(scan.startTime)/1000
        })
      );
      return acc;
    },
    []
  );
};
