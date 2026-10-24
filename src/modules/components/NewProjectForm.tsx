import React from 'react';
import { Form, Input } from 'antd';
import { FormProps } from 'rc-field-form/lib/Form';
import { ChoosePathInput } from './ChoosePathInput';
import { PathType } from '../../interfaces/pathType';

interface NewProjectFormProps {
  onFinish: FormProps['onFinish'];
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({ onFinish }) => (
  <Form
    id="newProjectForm"
    labelCol={{ xs: { span: 8 }, sm: { span: 8 }, md: { span: 8 }, lg: { span: 8 } }}
    wrapperCol={{ xs: { span: 12 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 12 } }}
    onFinish={onFinish}
    validateTrigger={['onSubmit', 'onBlur']}
  >
        <div style={{"color": "gray", "padding": "0 4rem", "marginBottom": "1rem", "fontSize": "small"}}>
          A project is tied to a targeted application. Using projects you can perform multiple scans of the same codebase as it evolves over time. Directories, ASAR archives, and single files containing Javascript, Typescript, and HTML resources are supported.
      </div>
    <Form.Item
      label="Project name"
      name="projectName"
      initialValue={`Temporary project ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/,'').replace(/:/g, "-")}`}
      rules={[
        {
          required: true,
          message: "Please input your new scanning projects' name.",
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Project file location"
      name="projectLocation"
      tooltip="Where do you want to save your file with scans?"
      rules={[
        {
          required: true,
          message: "Please select your scanning projects' location.",
        },
      ]}
    >
      <ChoosePathInput type={PathType.directory} />
    </Form.Item>
    <Form.Item
      label="Application path to scan"
      name="applicationPath"
      tooltip="A path to the Electron-based application you want to scan."
      rules={[
        {
          required: true,
          message: 'Please select the directory of the application to be scanned.',
        },
      ]}
    >
      <ChoosePathInput type={PathType.fileOrDirectory} />
    </Form.Item>
  </Form>
);
