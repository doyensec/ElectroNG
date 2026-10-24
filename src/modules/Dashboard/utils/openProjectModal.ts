import { ipcRenderer } from 'electron';
import { openProject } from './openProject';

export const openProjectModal = (updateProjectList: () => void) => {
  return async () => {
    const engFile: string = await ipcRenderer.invoke(`get-file-path`);

    // this check avoids that clicking on "Open Project" in the dashboard and then on "Cancel" shows an error message
    // because the path would be empty
    if (engFile === "")
      return;

    await openProject(engFile);

    updateProjectList();
  };
};
