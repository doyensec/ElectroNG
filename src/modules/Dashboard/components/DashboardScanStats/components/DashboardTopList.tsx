import React from 'react';
import { Avatar, Card, List, Tag } from 'antd';

export interface DashboardTopListDataSource {
  title: string;
  tag?: {
    color: string;
    text: string;
  };
}

interface DashboardTopListProps {
  title: string;
  dataSource: Array<DashboardTopListDataSource>;
}

export const DashboardTopList = ({
  title,
  dataSource,
}: DashboardTopListProps) => (
  <Card title={title} bodyStyle={{ height: 468 }}>
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      split={false}
      size="small"
      renderItem={(item, index) => (
        <List.Item
          extra={
            item.tag ? (
              <Tag color={item.tag?.color}>{item.tag?.text}</Tag>
            ) : null
          }
        >
          <List.Item.Meta
            avatar={
              <Avatar
                size={20}
                gap={1}
                style={{
                  fontSize: '.8em',
                  backgroundColor: index < 3 ? '#314659' : '#F0F2F5',
                  color: index < 3 ? '#FFF' : '#545456',
                }}
              >
                {index + 1}
              </Avatar>
            }
            title={
              <span
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {item.title}
              </span>
            }
          />
        </List.Item>
      )}
    />
  </Card>
);
