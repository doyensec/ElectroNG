import { Modal } from 'antd';
import React from 'react';

export const DescriptionModal = ({ isVisible, description, onCancel }) => (
  <Modal
    title="Description"
    visible={isVisible}
    destroyOnClose
    onCancel={onCancel}
    footer={null}
    width={1000}
    style={{ height : 90}}
  >
    <iframe width="100%" height="600" frameBorder="0" srcDoc={ description }  style={{ overflow: 'scroll'}} >
    </iframe>
  </Modal>
);
