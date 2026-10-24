import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Progress, Space, Typography } from 'antd';
import { getLatestScan, getProject, getScan } from '../utils';
import { Project } from './interfaces';
import { DateFormats } from '../../../constants/DateFormats';
import { formatDate } from '../../../utils';

interface DashboardTitleProps {
  isRunningScanSelected: boolean;
  projects: Array<Project>;
  projectId: string;
  scanId: string;
  startTime: Date | null;
  progress: number | null;
  onDelete: () => void;
}

export const DashboardTitle: React.FC<DashboardTitleProps> = ({
  isRunningScanSelected,
  projects,
  startTime,
  progress,
  projectId,
  scanId,
  onDelete,
}) => {
  const projectName =
    getProject(projects, projectId)?.index?.label || projectId;
  const scan =
    getScan(projects, projectId, scanId) || getLatestScan(projects, projectId);
  const runningScan = isRunningScanSelected && startTime && progress;
  let scanName;

  if (!scan) {
    scanName = '';
  } else {
    scanName =
      scan?.options?.label ||
      `Scan generated on ${formatDate(
        scan?.endTime as Date,
        DateFormats.dateAndTime
      )}`;
  }

  const horizontalPadding = '2em';
  const verticalPadding = '1em';
  const marginBetweenBreadcrumbsAndTitle = scanName ? '.7em' : 0;

  const cardBodyStyle = {
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
    paddingRight: horizontalPadding,
    paddingLeft: horizontalPadding,
  };

  const titleStyle = {
    marginBottom: 0,
    marginTop: marginBetweenBreadcrumbsAndTitle,
  };

  return (
    <Card bodyStyle={cardBodyStyle}>
      {scanName && (
        <Breadcrumb>
          <Breadcrumb.Item>{projectName}</Breadcrumb.Item>
          <Breadcrumb.Item>{scanName}</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Typography.Title level={4} style={titleStyle}>
          {scanName || projectName}
        </Typography.Title>
        {runningScan ? (
          <Space size={5}>
            <InfoCircleOutlined style={{ color: 'blue' }} />
            Started at {formatDate(startTime as Date, DateFormats.dateAndTime)}
          </Space>
        ) : progress ? null : ( // Unable to delete the project when running a scan
          <Button type="primary" danger onClick={onDelete}>
            {scanId ? 'Delete scan' :   'Delete project'  }
            
          </Button>
        )}
      </div>
      {runningScan && (
        <Progress
          style={titleStyle}
          percent={progress as number}
          status="active"
        />
      )}
    </Card>
  );
};
