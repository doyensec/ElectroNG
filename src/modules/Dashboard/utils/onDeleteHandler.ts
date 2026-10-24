import _ from 'lodash';
import { Project } from '../components';
import { ipcRenderer } from 'electron';

export const onDeleteHandler = (
  projects: Project[],
  projectId: string,
  scanId: string,
  updateProjectList: () => Promise<void>
) => async () => {
  const currentProject = _.find<Project>(projects, ['index.id', projectId]);

  if (scanId) {
    try {
      await currentProject?.deleteScan(scanId);
    } catch (e) {
      console.log(e);
    }
    await updateProjectList();
  } else if (projectId) {
    const savedProjects = await ipcRenderer.invoke('get-last-projects');
    const rejects = _.reject(savedProjects, [
      'projectPath',
      currentProject?.projectPath,
    ]);

    await ipcRenderer.send('overwrite-last-projects', rejects);

    await updateProjectList();
  }
};
