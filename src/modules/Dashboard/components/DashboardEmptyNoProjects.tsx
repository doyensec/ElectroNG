import React from 'react';
import { Button, Empty, Space, Typography } from 'antd';

interface DashboardEmptyProps {
  onNewProject: () => void;
  onOpenProject: () => void;
}
export const DashboardEmptyNoProjects = ({ onNewProject, onOpenProject }: DashboardEmptyProps) => (
  <Empty
    style={{
      top: '50%',
      left: 'calc(50% + 100px)',
      transform: 'translate(-50%, calc(-50% + 70px))',
      position: 'absolute',
    }}
    description={
      <>
        <Typography.Title level={2}>No projects to show</Typography.Title>
        <Typography.Paragraph type="secondary">
          Create a new project or open an existing one.
        </Typography.Paragraph>
      </>
    }
  >
    <Space direction="vertical">
      <Button type="primary" onClick={onNewProject}>
        New project
      </Button>
      <Button type="ghost" onClick={onOpenProject}>
        Open project
      </Button>
    </Space>
  </Empty>
);
