import React, { useState } from 'react';
import * as _ from 'lodash';
import { Col, Form, Input, Modal, Row, Space, Table } from 'antd';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getAvailableChecks } from '@doyensec/electrong-core/dist/core';
import { runFollowingChecksColumns } from './runFollowingChecksColumns';
import { scanSettingsOptions } from './scanSettingsOptions';
import { AvailableCheck } from './interfaces';

const scanSettingsColumns = [
  {
    title: 'Scan settings',
    dataIndex: 'name',
  },
];

interface DashboardNewScanProps {
  isModalVisible: boolean;
  handleOk: (
    scanLabel: string,
    customScan: string[],
    severitySet: string,
    confidenceSet: string,
    electronOfTargetApp: string,
    runUpgradeChecks: string
  ) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const DashboardNewScanModal = ({
  isModalVisible,
  handleOk,
  handleCancel,
}: DashboardNewScanProps) => {
  const [filterChecksByText, filterChecksBy] = useState<string>('');
  const [allChecks] = useState<Array<AvailableCheck>>(
    _.reject(getAvailableChecks(), ['type', 'N/A'])
  );
  const [scanLabel, setScanLabel] = useState<string>('');
  const [electronOfTargetApp, onElectronVersionChange] = useState<string>('');
  const [runUpgradeChecks, setRunUpgradeChecks] = useState<string>('');
  const [selectedSeverity, onSeverityChange] = useState<string>('');
  const [selectedConfidence, onConfidenceChange] = useState<string>('');
  const [selectedRowKeys, onSelectChange] = useState<string[]>(_.map(allChecks, ({ name }) => name));
  const rowSelection = {
    selectedRowKeys,
    onChange: (rows: string[]) => {
      onSelectChange(rows);
    },
  };

  return (
    <Modal
      title="New scan"
      visible={isModalVisible}
      onOk={() =>
        handleOk(
          scanLabel,
          selectedRowKeys,
          selectedSeverity,
          selectedConfidence,
          electronOfTargetApp,
          runUpgradeChecks
        )
      }
      okText="Start scan"
      onCancel={handleCancel}
      width={800}
    >
      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%', paddingTop: 30 }}
      >
        <Row>
          <Col span={12}>
            <Form
              labelCol={{ span: 6, push: 10 }}
              wrapperCol={{ span: 20, push: 10 }}
            >
              <Form.Item label="Scan name">
                <Input onChange={({ target }) => setScanLabel(target.value)} placeholder="Optional" />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Table
          columns={scanSettingsColumns}
          dataSource={scanSettingsOptions(
            onElectronVersionChange,
            setRunUpgradeChecks,
            onSeverityChange,
            onConfidenceChange
          )}
          pagination={false}
        />
        <Table
          columns={runFollowingChecksColumns(filterChecksBy)}
          rowKey="name"
          dataSource={_.filter(allChecks, (availableCheck) => {
            return _.map(_.values(availableCheck), (value) =>
              value.toLowerCase()?.includes(filterChecksByText?.toLowerCase())
            ).includes(true);
          })}
          rowSelection={rowSelection as any}
          pagination={false}
        />
      </Space>
    </Modal>
  );
};
