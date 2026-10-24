import React from 'react';
import * as _ from 'lodash';
import { Button, Select, Space } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { SeverityColors } from '../../../../../../constants/SeverityColors';
import { severityLevels } from '../../../DashboardNewScanModal/scanSettingsOptions';

interface DashboardEnumerationSeverityDetailsProps {
  severityValue: string;
  triageValue: string;
  onChange: (details: any) => void;
}

export const DashboardEnumerationSeverityDetails = ({
  severityValue,
  triageValue,
  onChange,
}: DashboardEnumerationSeverityDetailsProps): JSX.Element => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <Select
      placeholder="Select"
      optionFilterProp="children"
      size="small"
      dropdownMatchSelectWidth={150}
      dropdownAlign=""
      value={severityValue}
      onChange={(severity) => {
        onChange({ severity });
      }}
    >
      {_.map(severityLevels, (severityLevel) => (
        <Select.Option
          key={severityLevel}
          value={severityLevel}
          title={severityLevel}
        >
          <Space>
            <span
              style={{
                width: '.57em',
                height: '.57em',
                borderRadius: '50%',
                backgroundColor: SeverityColors[severityLevel],
                display: 'inline-block',
                marginBottom: 1,
              }}
            />
            {_.startCase(severityLevel)}
          </Space>
        </Select.Option>
      ))}
    </Select>
    <span>
      <Button
        style={{ color: '#888' }}
        size="small"
        type="link"
        onClick={() => {
          onChange({ triage: "CONFIRMED" });
        }}
      >
        <CheckCircleFilled style={{ color: triageValue === "CONFIRMED" ? 'green' : '#ccc' }} />
        Valid
      </Button>
      <Button
        style={{ color: '#888' }}
        size="small"
        type="link"
        onClick={() => {
          onChange({ triage: "INVALID" });
        }}
      >
        <CloseCircleFilled style={{ color: triageValue === "INVALID" ? 'red' : '#ccc' }} />
        False positive
      </Button>
    </span>
  </div>
);
