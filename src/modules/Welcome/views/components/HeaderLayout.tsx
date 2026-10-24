import React from 'react';
import cs from 'classnames';
import { Button, Col, Layout, Row } from 'antd';
import { ipcRenderer } from 'electron';
import { CloseOutlined } from '@ant-design/icons';

import styles from '@Modules/Welcome/styles/WelcomeLayout.css';

const { Header } = Layout;
export const HeaderLayout = ({ title = '', isGrayPage = false }) => (
  <Header
    className={cs(styles.headerLayout, {
      [styles.headerBorder]: isGrayPage,
      [styles.headerSplashscreen]: !isGrayPage,
    })}
  >
    <Row>
      <Col span={22}>
        <span className={styles.headerLayoutTitle}>{title}</span>
      </Col>
      <Col span={1} offset={1}>
        <Button
          type="text"
          onClick={() => {
            ipcRenderer.send('close-this-window');
          }}
          icon={<CloseOutlined />}
        />
      </Col>
    </Row>
  </Header>
);
