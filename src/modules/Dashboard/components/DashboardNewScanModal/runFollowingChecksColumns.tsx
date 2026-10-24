import React from 'react';
import { Input, Tag } from 'antd';
import { AvailableCheck } from './interfaces';
import styles from '@Modules/Dashboard/styles/DashboardNewScan.css';

const tagColors = {
  JAVASCRIPT: 'yellow',
  HTML: 'orange',
  CSS: 'blue',
  JSON: 'green',
};

export const runFollowingChecksColumns = (
  onChange: React.Dispatch<React.SetStateAction<string>>
) => [
  {
    title: (
      <div className={styles.titleWrapper}>
        <span className={styles.title}>Run the following checks</span>
        <Input.Search
          placeholder="Search by name or type"
          allowClear
          onChange={({ target }) => onChange(target.value)}
          className={styles.search}
        />
      </div>
    ),
    key: 'name',
    render: (
      _checkName: string,
      { type, title, description }: AvailableCheck
    ) => (
      <>
        <Tag color={tagColors[type]}>{type}</Tag> <b>{title}</b> — {description}
      </>
    ),
  },
];
