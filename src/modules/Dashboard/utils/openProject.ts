import { ipcRenderer } from 'electron';

export const openProject = async (engFile: string) => {
  if (engFile && engFile.endsWith('.eng')) {
    await ipcRenderer.send('save-last-project', {
      name: engFile.split('/').splice(-1)[0].replace('.eng', ''),
      projectPath: engFile,
    });
  }
  else {
      throw new Error('Unsupported file')
  }
};
