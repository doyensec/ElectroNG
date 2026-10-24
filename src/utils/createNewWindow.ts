import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import MenuBuilder from '../menu';

export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  return path.join(RESOURCES_PATH, ...paths);
};

export const createNewWindow = (
  routePath = '',
  isWelcome = false
): BrowserWindow | null => {
  let mainWindow: BrowserWindow | null = null;
  const isDashboard = !isWelcome;

  mainWindow = new BrowserWindow({
    show: false,
    width: isWelcome ? 863 : 1300,
    height: isWelcome ? 622 : 800,
    minWidth: isWelcome ? 863 : 1010,
    minHeight: isWelcome ? 622 : 470,
    frame: true, //isDashboard, - for Windows compatibility, avoid the frameless splashscreen window
    resizable: isDashboard,
    // opacity: 0.7,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'ElectroNG'
  });

  if (process.env.NODE_ENV === 'development')
    mainWindow.loadURL(`file://${__dirname}/../index.html#${routePath}`);
  else
    mainWindow.loadURL(`file://${__dirname}/index.html#${routePath}`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    // mainWindow.webContents.openDevTools();
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.on('close-this-window', () => {
    app.exit(0);
  });
    // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    app.quit()
  })

  return mainWindow;
};
