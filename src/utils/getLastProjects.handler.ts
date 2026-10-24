import settings from 'electron-settings';
import { IpcMainInvokeEvent } from 'electron';
import { LastProject } from '../interfaces/LastProject';

export const getLastProjectsHandler = (
  _: IpcMainInvokeEvent
): LastProject[] => {
  return ((settings.getSync('lastProjects') || []) as unknown) as LastProject[];
};
