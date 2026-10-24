import React from 'react';
import { Button, Modal } from 'antd';
import { FormProps } from 'rc-field-form/lib/Form';
import { NewProjectForm } from '../../components/NewProjectForm';

interface DashboardNewProjectModalProps {
  visible: boolean;
  onFinish: FormProps['onFinish'];
  onCancel: () => void;
}

export const DashboardNewProjectModal = ({
  visible,
  onFinish,
  onCancel,
}: DashboardNewProjectModalProps) => (
  <Modal
    title="New Project"
    visible={visible}
    style={{ width: 300 }}
    width="75%"
    destroyOnClose
    footer={
      <Button form="newProjectForm" key="submit" htmlType="submit">
        Create
      </Button>
    }
    onCancel={onCancel}
  >
    <NewProjectForm onFinish={onFinish} />
  </Modal>
);
