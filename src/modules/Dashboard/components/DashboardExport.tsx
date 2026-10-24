import React, { useEffect } from 'react';
import { Form, Input, Modal, Radio, Space, Table } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import { ChoosePathInput } from '../../components/ChoosePathInput';
import { PathType } from '../../../interfaces/pathType';
import { GenerateReportOptions } from "./interfaces";

const columns = [
  {
    title: <div style={{ float: 'left' }}>Include</div>,
    dataIndex: 'name',
  },
];

interface DetailsToShowInReport {
  key: string;
  name: string;
  value: string;
}

const getDetailOptions = (
  isExportingFinding: boolean
): Array<DetailsToShowInReport> =>
  _.compact([
    {
      key: '1',
      name: 'Only provide relative paths',
      value: 'onlyShowRelativePath',
    },
    isExportingFinding
      ? null
      : {
          key: '2',
          name: 'Findings',
          value: 'showFindings',
        },
    isExportingFinding
      ? null
      : {
          key: '3',
          name: 'Include the "Project findings" table',
          value: 'showTableSummary',
        },
    {
      key: '4',
      name: 'Proof Of Concept Code',
      value: 'showPoCs',
    },
    {
      key: '5',
      name: 'Notes',
      value: 'showAuditorNotes',
    },
  ]);

export interface DashboardExportProps {
  findingId: string | null;
  isModalVisible: boolean;
  handleOk: (options: GenerateReportOptions, findingId: string | null) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export const DashboardExport = ({
  findingId,
  isModalVisible,
  handleOk,
  handleCancel,
}: DashboardExportProps) => {
  const [form, setForm] = React.useState<GenerateReportOptions>({
    label: '',
    outputFileFormat: 'pdf',
    outputOptions: {},
    outputPath: '',
  });
  const [selectedDetails, setSelectedDetails] = React.useState<string[]>(getDetailOptions(!!findingId).map(element => element.key));
  const [detailOptions, setDetailOptions] = React.useState<Array<DetailsToShowInReport>>([]);

  React.useEffect(() => {
    setDetailOptions(getDetailOptions(!!findingId))
  }, [findingId])

  const rowSelection = {
    selectedRowKeys: selectedDetails,
    onChange: (keys: string[], objects: Array<DetailsToShowInReport>) => {
      const formValues = {
        ...form,
        outputOptions: _.reduce(
          _.map(objects, 'value'),
          (acc: { [key: string]: boolean }, o: string) => {
            acc[o] = true;
            return acc;
          },
          {}
        ),
      };

      setSelectedDetails(keys);
      setForm(formValues);
    },
  };

  // Update the form with default value (allChecks)
  useEffect(()=> {  

    const allDetailsExport = getDetailOptions(!!findingId);
    setForm({...form, outputOptions: _.reduce(
      _.map(allDetailsExport, 'value'),
      (acc: { [key: string]: boolean }, o: string) => {
        acc[o] = true;
        return acc;
      },
      {}
    )});
  }, [])

  return (
    <Modal
      title="Export report"
      visible={isModalVisible}
      okText={
        <Space>
          <ExportOutlined />
          Export
        </Space>
      }
      destroyOnClose
      okButtonProps={{ disabled: form.outputPath.trim() === '' || form.label.trim() === '' }}
      cancelButtonProps={{ type: 'link' }}
      onOk={() => {
        handleOk({
          label: form.label,
          outputFileFormat: form.outputFileFormat,
          outputOptions: form.outputOptions,
          outputPath: `${form.outputPath}/${form.label}.${form.outputFileFormat}`,
        }, findingId);
      }}
      onCancel={handleCancel}
    >
      <Form layout="vertical">
        <Form.Item label="Name report" rules={[{ required: true }]}>
          <Input
            value={form.label}
            onChange={({ target }) => setForm({ ...form, label: target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Export path"
          tooltip="A path the report will be exported."
        >
          <ChoosePathInput
            type={PathType.directory}
            onChange={(outputPath) => {
              setForm({ ...form, outputPath });
              return outputPath;
            }}
          />
        </Form.Item>
        <Form.Item
          label="Export type"
          rules={[{ required: true, message: 'Select the type' }]}
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={({ target }) =>
              setForm({ ...form, outputFileFormat: target.value })
            }
            defaultValue = {form.outputFileFormat}
          >
            <Radio.Button value="pdf">PDF</Radio.Button>
            <Radio.Button value="html">HTML</Radio.Button>
            <Radio.Button value="csv">CSV</Radio.Button>
            <Radio.Button value="sarif">Sarif</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Table
          style={{ direction: 'rtl' }}
          columns={columns}
          dataSource={detailOptions}
          rowSelection={rowSelection as any}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};
