import * as React from 'react';
import * as _ from 'lodash';
import { Table, Tooltip } from 'antd';

interface DashboardBrowserPropertyTableProps {
  browserProperties: any[];
}

export const DashboardBrowserPropertyTable = ({
  browserProperties,
}: DashboardBrowserPropertyTableProps) => {

  const expandedRowRender = (record: any) => {
    const columns = [
      { title: 'Setting name', dataIndex: 'settingName', key: 'settingName' },
      { title: 'Explicitly set value', dataIndex: 'isSet', key: 'isSet' },
      {
        title: 'Default value',
        dataIndex: 'default',
        key: 'default',
      },
      {
        title: '',
        dataIndex: 'warning',
        key: 'default',
        render: (toRender: boolean) => <div hidden={!toRender} style={{color: 'red'}}><Tooltip placement="left" title={'Current value differs from default'}>&#9888;</Tooltip></div>,
        // sorter: (a: boolean, b: boolean) => a !== b
      }
    ];

    return (
      <Table
        columns={columns}
        dataSource={_.reduce(
          record.properties.webPreferences,
          (acc: any[], value: any) => {
            const keys = _.keys(value);
            keys.forEach((key: string) => {
              if (!['default', 'isSet'].includes(key)) {
                acc.push({
                  settingName: key,
                  isSet: `${value.isSet}`,
                  default: `${value.default}`,
                  warning: value.isSet !== value.default
                });
              }
            });
            return acc;
          },
          []
        )}
        pagination={false}
      />
    );
  };

  const columns = [
    { title: 'Window type', dataIndex: ['properties', 'windowType'] },
    { title: 'Window name', dataIndex: ['properties', 'windowName'] },
    { title: 'Source file', dataIndex: 'file', key: 'file' },
  ];

  return (
    <Table
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={browserProperties}
      rowKey={({ properties }) => properties.windowName}
      pagination={false}
    />
  );
};
