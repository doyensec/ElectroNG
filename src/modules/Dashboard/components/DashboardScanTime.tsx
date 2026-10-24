import React from 'react';
import _ from 'lodash';
import { Card, Statistic } from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ScanFinished } from './interfaces';
import { formatDate } from '../../../utils/formatDate';
import { DateFormats } from '../../../constants/DateFormats';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface ScanTimeStatisticsProperties {
  title: string;
  value: string;
}

interface ScanTimeStatistics {
  startedAt: ScanTimeStatisticsProperties;
  finishedAt: ScanTimeStatisticsProperties;
  duration: ScanTimeStatisticsProperties;
}

export interface DashboardScanTimeProps {
  showTitle: boolean;
  statistics: ScanFinished | null;
}

export const DashboardScanTime = ({
  showTitle,
  statistics,
}: DashboardScanTimeProps): JSX.Element => {
  const finishedScanStats: ScanTimeStatistics = {
    startedAt: {
      title: 'Started at',
      // value: statistics.startTime?.toString(),
      value: formatDate(
        statistics?.startTime || new Date(),
        DateFormats.timeAndDate
      ),
    },
    finishedAt: {
      title: 'Finished at',
      // value: statistics.endTime?.toString(),
      value: formatDate(
        statistics?.endTime || new Date(),
        DateFormats.timeAndDate
      ),
    },
    duration: {
      title: 'Duration',
      value: dayjs
        .duration(dayjs(statistics?.endTime).diff(dayjs(statistics?.startTime)))
        .humanize(),
    },
  };

  return (
    <Card title={showTitle ? 'Latest scan' : ''}>
      {_.map(finishedScanStats, ({ title, value }) => (
        <Card.Grid
          key={title}
          style={{ textAlign: 'center' }}
          hoverable={false}
        >
          <Statistic
            title={title}
            value={value}
            valueStyle={{ fontSize: '2vw' }}
          />
        </Card.Grid>
      ))}
    </Card>
  );
};
