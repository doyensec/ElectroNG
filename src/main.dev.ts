/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  app,
  remote,
  BrowserWindow,
  ipcMain,
  nativeImage,
  shell,
} from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import settings from 'electron-settings';
import { initiateScan } from '@doyensec/electrong-core';
import { PathType } from './interfaces/pathType';
import {
  getLastProjectsHandler,
  getPathHandler,
  handlePdfCreation,
  loadFileHandler,
  overwriteLastProjectsHandler,
  saveLastProjectHandler,
} from './utils';
import { createNewWindow, getAssetPath } from './utils/createNewWindow';
import { handleSaveFile } from './utils/handleSaveFile';
import { initializeScanHandler } from './utils/initializeScan.handler';
import {
  CHECK_FOR_UPDATES_EVENT,
  checkForUpdates,
  isAutoUpdateEnabled,
} from './utils/checkForUpdates';

const { Command } = require('commander');

const program = new Command();

export default class AppUpdater {
  constructor() {
    app.on(CHECK_FOR_UPDATES_EVENT, () => {
      checkForUpdates({ silent: false });
    });

    // Avoid the autoUpdate when ElectroNG is launched from the dmg
    console.log(`current launch path ${process.env.APP_PATH}`);
    if (
      process.env.NODE_ENV !== 'development' &&
      !process.env.APP_PATH?.includes('/Volumes') &&
      isAutoUpdateEnabled()
    )
      checkForUpdates({ silent: false });
  }
}

process.env.APP_PATH = app.getAppPath();

let mainWindow: BrowserWindow | null = null;

const { build } = require('../package.json');

const appData = app.getPath('appData');
app.setPath('userData', path.join(appData, build.productName));

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

let headlessMode = false;

const parseCLIArguments = async () => {
  if (process.argv) {
    program
      .option('-i, --inputPath <path>', 'input path [directory]')
      .option(
        '-l, --checks <checkNames>',
        'only run the specified checks list, passed in csv format'
      )
      .option(
        '-x, --exclude-checks <excludedCheckNames>',
        'skip the specified checks list, passed in csv format'
      )
      .option(
        '-s, --severity <severitySet>',
        'only return findings with the specified level of severity or above'
      )
      .option(
        '-c, --confidence <confidenceSet>',
        'only return findings with the specified level of confidence or above'
      )
      .option(
        '-e, --electron-version <version>',
        'assume the set Electron version, overriding the detected one, eg -e 7.0.0 to treat as using Electron 7'
      )
      .option('-v, --versionCore print version', 'print version')
      .option('-r, ignore ', 'hackfix') // TODO: this is an hackfix for dev environment
      .parse(process.argv);

    if (program.versionCore) {
      headlessMode = true;
      console.log(process.env.ELECTRONG_VERSION);
      process.exit(0);
    } else if (program.inputPath) {
      headlessMode = true;

      console.log('Initiating scan');
      const input = path.resolve(program.inputPath);

      if (typeof program.checks !== undefined && program.checks) {
        program.checks = program.checks
          .split(',')
          .map((check: string) => check.trim().toLowerCase());
      } else program.checks = [];

      if (typeof program.excludeChecks !== undefined && program.excludeChecks) {
        program.excludeChecks = program.excludeChecks
          .split(',')
          .map((check: string) => check.trim().toLowerCase());
      } else program.excludeChecks = [];

      const scan = initiateScan({
        input,
        // projectFile: `/tmp/test-project-${Date.now()}.eng`, FIXME /
        // output:  `/tmp/test-report-${Date.now()}.html`, FIXME /
        // outputFileFormat: false,
        customScan: program.checks,
        excludeFromScan: program.excludeChecks,
        severitySet: program.severity,
        confidenceSet: program.confidence,
        electronVersionOverride: program.electronVersion,
        // excludeList: "",
        // parserPlugins: []
      });

      const subscription = scan.subscribe(
        (x) => {
          // console.log(x)

          if (x.status === 'Completed') {
            let numIssues = x.issues.length;
            // console.log(x)
            console.log(`Found ${numIssues} issues`);

            if (numIssues > 254) {
              // The maximum value is 255 which is equivalent to process.exit(-1) and is used for generic error (wrong confidence, ...)
              // so we return a max value of 254 in case of more than 254 issues
              numIssues = 254;
            }

            console.log(x.issues);
            process.exit(numIssues);
          }
        },
        (err) => {
          console.error(err);
          process.exit(-1);
        },
        () => {
          // This onComplete event is not reachable because the process exit in the onNext event when event.status === Completed.
          console.log('Scan finished.');
          process.exit(0);
        }
      );
    }
  }
};

const createWindow = async () => {
  if (headlessMode) return;

  console.log('Starting UI MODE');

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
    console.log('settings.file()', settings.file());
  }

  ipcMain.on('create-new-window', (_, arg) => {
    mainWindow?.close();
    createNewWindow(arg);
  });

  ipcMain.on('save-last-project', saveLastProjectHandler);

  ipcMain.on('overwrite-last-projects', overwriteLastProjectsHandler);

  ipcMain.handle('get-last-projects', getLastProjectsHandler);

  ipcMain.on('create-pdf', handlePdfCreation);

  ipcMain.on('save-file', handleSaveFile);

  mainWindow = createNewWindow('/splashscreen', true);

  mainWindow?.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.handle(
    'initialize-scan',
    initializeScanHandler(mainWindow as BrowserWindow)
  );

  ipcMain.handle('load-file', loadFileHandler(mainWindow as BrowserWindow));

  ipcMain.handle(
    'get-file-path',
    getPathHandler(mainWindow as BrowserWindow, PathType.file)
  );

  ipcMain.handle(
    'get-file-or-directory-path',
    getPathHandler(mainWindow as BrowserWindow, PathType.fileOrDirectory)
  );

  ipcMain.handle(
    'get-directory-path',
    getPathHandler(mainWindow as BrowserWindow, PathType.directory)
  );

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// app.on('window-all-closed', () => {
//   // Respect the OSX convention of having the application in memory even
//   // after all windows have been closed
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app.whenReady().then(parseCLIArguments).then(createWindow).catch(console.log);

app.on('web-contents-created', (event, contents) => {
  if (contents.getType() === 'webview') {
    contents.on('will-navigate', (navEvent, url) => {
      navEvent.preventDefault();
      shell.openExternal(url);
    });
  }
});

const image = nativeImage.createFromPath(getAssetPath('icon.png'));
app.dock.setIcon(image);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
