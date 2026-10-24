import { Input, Typography } from 'antd';
import React from 'react';

export const searchFiledColumnDefinition = (
  onInputChange: any,
  onDetailsClick: any
): any => ({
  title: <Input.Search placeholder="Search…" onChange={onInputChange} />,
  key: 'severity',
  width: 300,
  align: 'right',
  render: (_empty: any, record: any) => (
    <Typography.Link onClick={onDetailsClick(record)}>Details</Typography.Link>
  ),
});
