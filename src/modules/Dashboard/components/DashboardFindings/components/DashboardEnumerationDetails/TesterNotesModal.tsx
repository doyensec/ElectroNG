import { Input, Modal } from 'antd';
import React from 'react';

export const TesterNotesModal = ({
  isVisible,
  onOk,
  onCancel,
  testerNotes,
  onChange,
}) => (
  <Modal
    title="Edit tester notes"
    visible={isVisible}
    style={{ width: 300 }}
    destroyOnClose
    onOk={onOk}
    onCancel={onCancel}
  >
    <Input.TextArea
      value={testerNotes}
      rows={5}
      autoFocus
      autoSize
      onChange={onChange}
    />
  </Modal>
);
