import _ from 'lodash';
import { Project } from "../components";

export const getProject = (projects: any, prjId: string): Project | undefined =>
  _.find<Project>(projects, ['index.id', prjId]);
