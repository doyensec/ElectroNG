import { ScanStarted } from './ScanStarted';

export interface ScanFinished extends ScanStarted {
  endTime: Date;
}
