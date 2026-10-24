import settings from 'electron-settings';

export const AUTO_UPDATE_SETTING_KEY = 'autoUpdateEnabled';
export const CHECK_FOR_UPDATES_EVENT = 'electrong:check-for-updates';

export function isAutoUpdateEnabled(): boolean {
  return settings.getSync(AUTO_UPDATE_SETTING_KEY) === true;
}

export function setAutoUpdateEnabled(enabled: boolean): void {
  settings.setSync(AUTO_UPDATE_SETTING_KEY, enabled);
}
