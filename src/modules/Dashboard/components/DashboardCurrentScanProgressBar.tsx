import React from 'react';
import { Card, Progress, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { DateFormats } from '../../../constants/DateFormats';
import { formatDate } from "../../../utils";
import { ScanInProgress } from './interfaces';

export const DashboardCurrentScanProgressBar = ({
  startTime,
  progress,
}: Required<Omit<ScanInProgress, 'projectId' | 'scanId'>>): JSX.Element => (
  <Card
    title="Current scan"
    extra={
      <Space size={5}>
        <InfoCircleOutlined style={{ color: 'blue' }} />
        Started at {formatDate(startTime as Date, DateFormats.timeAndDate)}
      </Space>
    }
  >
    <Progress percent={progress} status="active" />
  </Card>
);
