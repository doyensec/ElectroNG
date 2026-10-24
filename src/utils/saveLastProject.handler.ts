import settings from 'electron-settings';
import * as _ from 'lodash';
import { IpcMainInvokeEvent } from 'electron';
import { LastProject } from '../interfaces/LastProject';
import { getLastProjectsHandler } from './getLastProjects.handler';

export const saveLastProjectHandler = (
  _ipc: IpcMainInvokeEvent,
  lastProject: LastProject
) => {
  const lastProjects = getLastProjectsHandler(_ipc);
  if (Array.isArray(lastProjects)) {
    settings.setSync(
      'lastProjects',
      _.uniqBy<any>([...lastProjects, { ...lastProject }], 'projectPath')
    );
  }
};
