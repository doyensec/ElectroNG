import { IpcMainInvokeEvent } from "electron";
import fs from 'fs';

export async function handleSaveFile(_: IpcMainInvokeEvent, { path, html }: {
  path: string,
  html: string,
}) {
  try {
    fs.writeFileSync(path, html)
  } catch (e) {
    console.log('Something went wrong', e);
  }
}
