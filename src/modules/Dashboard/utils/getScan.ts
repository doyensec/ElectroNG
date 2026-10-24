import _ from 'lodash';
import { Scan } from '../components/interfaces';
import { getProject } from './getProject';

export const getScan = (
  projects: any,
  prjId: string,
  scnId: string
): Scan | undefined =>
  _.find<Scan>(getProject(projects, prjId)?.scans, ['id', scnId]);
