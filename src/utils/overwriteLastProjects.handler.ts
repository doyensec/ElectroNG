import settings from 'electron-settings';
import * as _ from 'lodash';
import { IpcMainInvokeEvent } from 'electron';
import { LastProject } from '../interfaces/LastProject';

export const overwriteLastProjectsHandler = (
  _ipc: IpcMainInvokeEvent,
  lastProjects: Array<LastProject>
) => {
  if (Array.isArray(lastProjects)) {
    settings.setSync(
      'lastProjects',
      _.uniqBy<any>(lastProjects, 'projectPath')
    );
  }
};
