import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { ScanFinished } from '../interfaces';
import { DashboardScanTime } from '../DashboardScanTime';
import { DashboardEnumerationTable } from './components/DashboardEnumerationTable';
import { DashboardEnumerationDetails } from './components/DashboardEnumerationDetails';
import { Enumeration } from './interfaces/Enumeration';
import { EnumerationDetails } from './interfaces/EnumerationDetails';

export interface DashboardFindingsViewProps {
  findings: any;
  finishedStats: ScanFinished | null;
  onSaveProject: (currentEnumeration: any, details: EnumerationDetails) => void;
  onExportDetails: (findingId: string) => void;
  onGetFindingDetails: (findingId: string) => Promise<string>;
  onGetStoredFile: (sha2: string) => string
}

export const DashboardFindingsView = ({
  findings,
  finishedStats,
  onSaveProject,
  onExportDetails,
  onGetFindingDetails,
  onGetStoredFile
}: DashboardFindingsViewProps): JSX.Element => {
  const [
    currentEnumeration,
    setCurrentEnumeration,
  ] = useState<Enumeration | null>(null);

  return (
    <>
      <Col span={currentEnumeration ? 12 : 24}>
        <Row gutter={[18, 18]}>
          <Col span={24}>
            <DashboardScanTime showTitle={false} statistics={finishedStats} />
          </Col>
          <Col span={24}>
            <DashboardEnumerationTable
              enumerationsRaw={findings}
              setCurrentEnumeration={setCurrentEnumeration}
              isEnumerationSelected={!!currentEnumeration}
            />
          </Col>
        </Row>
      </Col>
      {currentEnumeration && (
        <Col span={12}>
          <DashboardEnumerationDetails
            currentEnumeration={currentEnumeration}
            onExportDetails={() => {
              onExportDetails(currentEnumeration?.uuid);
            }}
            onGetCurrentEnumerationDetails= {
              async () => {              
                const findingDetails =  await onGetFindingDetails(currentEnumeration?.uuid)
                return findingDetails
              }
            }
            onClose={() => {
              setCurrentEnumeration(null);
            }}
            onSave={(details) => {
              onSaveProject(currentEnumeration, details);
            }}
            onGetStoredFile = {
              (sha2: string) => {
                const fileContent = onGetStoredFile(sha2);
                return fileContent;
              }
            }
          />
        </Col>
      )}
    </>
  );
};
