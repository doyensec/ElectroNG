import { BrowserWindow, dialog, OpenDialogOptions } from 'electron';
import { PathType } from '../interfaces/pathType';

const openDialogTypeToProperties = (
  type: PathType
): OpenDialogOptions['properties'] => {
  // This is for selecting the destination of the .eng file
  if (type === PathType.directory) {
    return ['openDirectory'];
  }

  // This is for selecting a path to the project to scan
  if (type === PathType.fileOrDirectory) {
    return ['openFile', 'openDirectory'];
  }

  // This is for .eng files
  if (type === PathType.file) {
    return ['openFile'];
  }

  throw new Error('Unknown PathType');
};

export const getPathHandler = (
  mainWindow: BrowserWindow,
  type: PathType
) => async () => {
  const selected = await dialog.showOpenDialog(mainWindow, {
    // @ts-ignore
    properties: ['createDirectory', ...openDialogTypeToProperties(type)],
    filters: [
      {
        "name": "Allowed files",
        "extensions": ["asar", "js", "ts", "html", "htm", "jsx", "tsx", "json", "eng", "app"]
      },
    ]
  });

  return selected?.filePaths?.[0] || '';
};
