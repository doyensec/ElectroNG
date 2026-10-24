import React from 'react';
import { Line } from '@ant-design/plots';
import { LineConfig } from '@ant-design/plots/es/components/line';
import { ProjectSeverityStats } from '../../interfaces/ProjectSeverityStats';
import { ProjectAffectedFiles } from '../../interfaces/ProjectAffectedFiles';
import { ProjectMostFindings } from '../../interfaces/ProjectMostFindings';

interface DashboardChartProps
  extends Pick<LineConfig, 'xField' | 'yField' | 'seriesField' | 'color'> {
  data: Array<
    ProjectSeverityStats | ProjectAffectedFiles | ProjectMostFindings
  >;
}

export const DashboardChart = ({
  data,
  yField,
  xField,
  seriesField,
  color,
}: DashboardChartProps) => (
  <Line
    animation={false}
    data={data}
    padding="auto"
    xAxis={{
      tickCount: 5,
    }}
    slider={{
      start: 0,
      end: 1,
    }}
    yField={yField}
    xField={xField}
    seriesField={seriesField}
    color={color}
  />
);
