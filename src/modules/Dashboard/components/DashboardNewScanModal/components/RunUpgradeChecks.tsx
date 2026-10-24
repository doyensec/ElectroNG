import { Checkbox, Select } from 'antd';
import _ from 'lodash';
import React from 'react';
import { DefaultTableDropdownProps } from './DefaultTableDropdown';
import styles from '@Modules/Dashboard/styles/DashboardNewScan.css';

export const RunUpgradeChecks = ({
  placeholder,
  options,
  onChange,
}: Omit<DefaultTableDropdownProps, 'label'>) => {
  const [isChecked, setCheckbox] = React.useState(false);
  return (
    <div className={styles.titleWrapper}>
      <Checkbox
        value={isChecked}
        onChange={({ target: { checked } }) => {
          setCheckbox(checked);
          if (!checked) {
            onChange(false);
          }
        }}
      >
        Run upgrade checks
      </Checkbox>
      <Select
        showSearch
        disabled={!isChecked}
        className={styles.search}
        placeholder={placeholder}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
        }
        onChange={(value: string) => onChange(value)}
      >
        {_.map(options, (value) => (
          <Select.Option key={value} value={value}>
            {value}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
