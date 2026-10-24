/* eslint no-console: off */
import { app, BrowserWindow, dialog } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

export {
  AUTO_UPDATE_SETTING_KEY,
  CHECK_FOR_UPDATES_EVENT,
  isAutoUpdateEnabled,
  setAutoUpdateEnabled,
} from './autoUpdateSettings';

autoUpdater.autoDownload = false;
log.transports.file.level = 'debug';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'debug';

let isSilent: boolean;
let updateDownloaded = false;

/**
 * ensureSafeQuitAndInstall
 *
 * @access  public
 * @return  void
 */
export function ensureSafeQuitAndInstall() {
  app.removeAllListeners('window-all-closed');
  const browserWindows = BrowserWindow.getAllWindows();
  browserWindows.forEach((browserWindow) => {
    browserWindow.removeAllListeners('close');
  });
}

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('error', (error) => {
  console.log(`Error in autoUpdater. ${error}`);
  if (isSilent) return;
  dialog.showErrorBox(
    'Error during the update',
    `ElectroNG couldn't be updated. Please try again or contact the support team.`
  );
});

autoUpdater.on('update-available', () => {
  console.log('Update available.');
  if (isSilent) {
    autoUpdater.downloadUpdate();
    return;
  }
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Found Updates',
      message: 'New updates are available, do you want update now?',
      defaultId: 0,
      cancelId: 1,
      buttons: ['Yes', 'No'],
    })
    .then((event) => {
      if (event.response === 0) {
        autoUpdater.downloadUpdate();
      }
      return null;
    })
    .catch((error) => {
      console.log(`Error in autoUpdater. ${error}`);
    });
});

autoUpdater.on('update-not-available', () => {
  console.log('Update not available.');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded.');
  updateDownloaded = true;
  if (isSilent) return;
  dialog
    .showMessageBox({
      title: 'Install Updates',
      message: 'Updates are ready to be installed.',
      defaultId: 0,
      cancelId: 1,
      buttons: ['Install and restart', 'Close'],
    })
    .then((event) => {
      if (event.response === 0) {
        setImmediate(() => {
          ensureSafeQuitAndInstall();
          setTimeout(() => autoUpdater.quitAndInstall(true), 500);
        });
      }
      return null;
    })
    .catch((error) => {
      console.log(`Error in autoUpdater. ${error}`);
    });
});

export function checkForUpdates({ silent }: { silent: boolean }) {
  isSilent = silent;
  if (updateDownloaded) {
    dialog
      .showMessageBox({
        title: 'Available Updates',
        message: 'New updates are available and ready to be installed.',
        defaultId: 0,
        cancelId: 1,
        buttons: ['Install and restart', 'Close'],
      })
      .then((event) => {
        if (event.response === 0) {
          setImmediate(() => {
            ensureSafeQuitAndInstall();
            autoUpdater.quitAndInstall();
          });
        }
        return null;
      })
      .catch((error) => {
        console.log(`Error in autoUpdater. ${error}`);
      });
  } else {
    autoUpdater.checkForUpdates();
  }
}
