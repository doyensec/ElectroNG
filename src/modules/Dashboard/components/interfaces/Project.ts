import { Scan } from './Scan';

interface ProjectIndex {
  createdAt: Date;
  createdWith: string;
  formatVersion: number;
  id: string;
  label: string;
  lastKnownLocation: string;
  updatedAt: Date;
}

export interface Project {
  index: ProjectIndex;
  projectPath: string;
  scans: Scan[];
  save: () => Promise<void>;
  _generateReport: (scanId: string, options: any) => Promise<void>;
  _generateReportForFinding: (scanId: string, findingId: string, options: any) => Promise<void>;
  deleteScan(scanId: string): Promise<void>;
  _generateDetailsViewForFinding: (scanId: string, findingId: string, options: any) => string;
  getFileArtifact: (sha2: string) => string;
}
