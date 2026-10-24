import { ScanStarted } from './ScanStarted';

export interface ScanInProgress extends ScanStarted {
  projectId: string;
  scanId?: string;
  progress: number;
}
