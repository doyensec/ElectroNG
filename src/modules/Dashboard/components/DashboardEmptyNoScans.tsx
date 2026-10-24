import React from 'react';
import { Button, Empty, Typography } from 'antd';
import noScansImage from "../assets/no-scans.svg";

interface DashboardEmptyNoScansProps {
  onNewScan: () => void;
}
export const DashboardEmptyNoScans = ({ onNewScan }: DashboardEmptyNoScansProps) => (
  <Empty
    image={noScansImage as string}
    imageStyle={{
      height: 320,
    }}
    style={{
      top: '50%',
      left: 'calc(50% + 100px)',
      transform: 'translate(-50%, calc(-50% + 70px))',
      position: 'absolute',
    }}
    description={
      <Typography.Title level={2}>
        No scans
      </Typography.Title>
    }
  >
    <Button
      type="primary"
      onClick={onNewScan}
    >
      New scan
    </Button>
  </Empty>
);
