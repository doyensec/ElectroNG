import React from 'react';
import { Card } from 'antd';
import { Column } from '@ant-design/plots';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const DashboardSeverityLevels = ({ severityStats }): JSX.Element => {
  return (
    <Card title="Severity levels" bodyStyle={{ height: 468, padding: 0 }}>
      <Column
        animation={false}
        data={[
          { severityName: 'Low', occurrences: severityStats.low },
          { severityName: 'Medium', occurrences: severityStats.medium },
          { severityName: 'High', occurrences: severityStats.high },
          {
            severityName: 'Informational',
            occurrences: severityStats.informational,
          },
        ]}
        xField="severityName"
        yField="occurrences"
        appendPadding={24}
        color={({ severityName }: any) => {
          switch (severityName) {
            case 'Low':
              return '#6CCD3C';
            case 'Medium':
              return '#FBB937';
            case 'High':
              return '#FF6869';
            case 'Informational':
              return '#3AA1FF';
            default:
              return '#314659';
          }
        }}
        label={{
          position: 'middle',
          style: {
            fill: '#FFFFFF',
            opacity: 0.6,
          },
        }}
        xAxis={{
          label: {
            autoHide: true,
            autoRotate: false,
          },
        }}
      />
    </Card>
  );
};
