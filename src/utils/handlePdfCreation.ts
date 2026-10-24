import { BrowserWindow, IpcMainInvokeEvent } from 'electron';
import fs from 'fs';

export async function handlePdfCreation(
  _: IpcMainInvokeEvent,
  {
    path,
    html,
  }: {
    path: string;
    html: string;
  }
) {
  const window = new BrowserWindow({ show: false });

  try {
    window.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(html)}`);

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      window.webContents.on('did-finish-load', () => {
        window.webContents
          .printToPDF({ printBackground: true })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    });
    fs.writeFileSync(path, buffer);
  } catch (e) {
    console.log('Something went wrong', e);
  } finally {
    window.close();
  }
}
