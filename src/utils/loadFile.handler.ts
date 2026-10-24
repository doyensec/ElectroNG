import fs from 'fs';
import { BrowserWindow } from 'electron';

export const loadFileHandler = (_window: BrowserWindow) => async (
  _event: any,
  filePath: string
) => {
  return filePath && fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
};
