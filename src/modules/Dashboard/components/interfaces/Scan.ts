import { ScanInProgress } from './ScanInProgress';
import { ScanFinished } from './ScanFinished';

export interface Scan extends Partial<ScanInProgress>, Partial<ScanFinished> {
  options: { [key: string]: any };
  id: string;
  name: string;
  issues: any;
  decorators: any;
}
