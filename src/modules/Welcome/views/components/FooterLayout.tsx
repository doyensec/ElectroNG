import React from 'react';
import { Col, Row } from 'antd';
import styles from '@Modules/Welcome/styles/WelcomeLayout.css';

export const FooterLayout = ({ left = <></>, right = <></> }) => (
  <Row gutter={[0, 0]}>
    <Col span={8}>{left}</Col>
    <Col span={11} offset={5} className={styles.footerLayoutRight}>
      {right}
    </Col>
  </Row>
);
