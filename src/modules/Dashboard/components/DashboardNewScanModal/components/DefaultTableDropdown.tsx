import { Select } from 'antd';
import _ from 'lodash';
import React from 'react';
import styles from '@Modules/Dashboard/styles/DashboardNewScan.css';

const titleWrapperWithoutCheckbox = `${styles.titleWrapper} ${styles.scanSettingWithoutCheckbox}`;

export interface DefaultTableDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  onChange: (value: string | boolean) => void;
  defaultValue?: string;
}

export const DefaultTableDropdown = ({
  label,
  placeholder,
  options,
  onChange,
  defaultValue,
}: DefaultTableDropdownProps) => (
  <div className={titleWrapperWithoutCheckbox}>
    <span className={styles.title}>{label}</span>
    <Select
      allowClear = { label.includes('Electron version') }
      showSearch
      className={styles.search}
      placeholder={placeholder}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
      }
      onChange={(value: string) => onChange(value)}
      defaultValue={defaultValue}
    >
      {_.map(options, (value) => (
        <Select.Option key={value} value={value}>
          {value}
        </Select.Option>
      ))}
    </Select>
  </div>
);
