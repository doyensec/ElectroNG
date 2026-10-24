import React from 'react';
import { Card, Col } from 'antd';
import { DashboardScanTime } from '../DashboardScanTime';
import { DashboardCurrentScanProgressBar } from '../DashboardCurrentScanProgressBar';
import {
  DashboardChart,
  DashboardSeverityLevels,
  DashboardTopList,
  DashboardTopListDataSource,
} from './components';
import { ScanFinished, ScanInProgress } from '../interfaces';
import { ProjectSeverityStats } from '../interfaces/ProjectSeverityStats';
import { ProjectAffectedFiles } from '../interfaces/ProjectAffectedFiles';
import { ProjectMostFindings } from '../interfaces/ProjectMostFindings';
import { DashboardBrowserPropertyTable } from '../DashboardBrowserPropertyTable';

interface SeverityStats {
  low: number;
  medium: number;
  high: number;
  informational: number;
}

interface DashboardScanStatsProps {
  isProjectSelected: boolean;
  isScanSelected: boolean;
  isLatestRunning: boolean;
  finishedStats: ScanFinished | null;
  runningStats: ScanInProgress | null;
  lastScanSeverityStats: SeverityStats;
  lastScanAffectedFiles: Array<DashboardTopListDataSource>;
  lastScanMostFindings: Array<DashboardTopListDataSource>;
  projectSeverityStats: Array<ProjectSeverityStats>;
  projectAffectedFiles: Array<ProjectAffectedFiles>;
  projectMostFindings: Array<ProjectMostFindings>;
  browserProperties: any;
}

export const DashboardScanStatsView = ({
  isProjectSelected,
  isScanSelected,
  finishedStats,
  isLatestRunning,
  runningStats,
  lastScanSeverityStats,
  lastScanAffectedFiles,
  lastScanMostFindings,
  projectSeverityStats,
  projectAffectedFiles,
  projectMostFindings,
  browserProperties,
}: DashboardScanStatsProps): JSX.Element => {
  const finishedProjectOrScanSelected =
    ((isProjectSelected && !isLatestRunning) || isScanSelected) &&
    finishedStats;
  const runningProject = isProjectSelected && isLatestRunning && runningStats;

  return (
    <>
      <Col span={24}>
        {finishedProjectOrScanSelected && (
          <DashboardScanTime
            showTitle={isProjectSelected}
            statistics={finishedStats as ScanFinished}
          />
        )}
        {runningProject && (
          <DashboardCurrentScanProgressBar
            progress={(runningStats as ScanInProgress).progress}
            startTime={(runningStats as ScanInProgress).startTime}
          />
        )}
      </Col>

      {finishedStats && (
        <>
          <Col span={24} lg={24} xl={8}>
            <DashboardSeverityLevels severityStats={lastScanSeverityStats} />
          </Col>
          <Col xs={24} lg={12} xl={8}>
            <DashboardTopList
              title="Top 10 most affected files"
              dataSource={lastScanAffectedFiles}
            />
          </Col>
          <Col xs={24} lg={12} xl={8}>
            <DashboardTopList
              title="Top 10 most findings/warnings type"
              dataSource={lastScanMostFindings}
            />
          </Col>
        </>
      )}

      {isProjectSelected && (
        <>
          <Col span={24}>
            <Card title="Summary of project's severities">
              <DashboardChart
                data={projectSeverityStats.sort((a, b) => {
                  const data1 = a.rawDateTime;
                  const data2 = b.rawDateTime;
                  return data1 - data2;
                })}
                xField="scanTime"
                yField="severityLevel"
                seriesField="severityName"
                color={({ severityName }: any) => {
                  switch (severityName) {
                    case 'low':
                      return '#6CCD3C';
                    case 'medium':
                      return '#FBB937';
                    case 'high':
                      return '#FF6869';
                    case 'informational':
                      return '#3AA1FF';
                    default:
                      return '#314659';
                  }
                }}
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Summary top 10 most affected files">
              <DashboardChart
                data={projectAffectedFiles.sort((a, b) => {
                  const data1 = a.rawDateTime;
                  const data2 = b.rawDateTime;
                  return data1 - data2;
                })}
                xField="scanTime"
                yField="occurrences"
                seriesField="fileName"
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Summary top 10 findings/warnings">
              <DashboardChart
                data={projectMostFindings.sort((a, b) => {
                  const data1 = a.rawDateTime;
                  const data2 = b.rawDateTime;
                  return data1 - data2;
                })}
                xField="scanTime"
                yField="occurrences"
                seriesField="findingName"
              />
            </Card>
          </Col>
        </>
      )}

      {isScanSelected && (
        <Col span={24}>
          <Card title="Browser properties">
            <DashboardBrowserPropertyTable browserProperties={browserProperties} />
          </Card>
        </Col>
      )}
    </>
  );
};
