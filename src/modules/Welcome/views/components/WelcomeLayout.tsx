import React from 'react';
import cs from 'classnames';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import styles from '@Modules/Welcome/styles/WelcomeLayout.css';
import { HeaderLayout } from './HeaderLayout';
import routes from '../../../../constants/routes.json';

const { Content, Footer } = Layout;

interface WelcomeLayoutProps {
  content: React.ReactElement;
  footer: React.ReactElement;
}

export const WelcomeLayout = ({
  content,
  footer,
}: WelcomeLayoutProps): JSX.Element => {
  const { pathname } = useLocation();

  const config = {
    [routes.NEW_PROJECT]: {
      title: 'New project',
      isGrayPage: true,
    },
  };

  const title = config[pathname]?.title || '';
  const isGrayPage = config[pathname]?.isGrayPage || false;
  return (
    <Layout className={styles.welcomeView}>
      <Layout>
        <HeaderLayout title={title} isGrayPage={isGrayPage} />
        <Content>{content}</Content>
        <Footer
          className={cs(styles.footerLayout, {
            [styles.footerBorder]: isGrayPage,
          })}
        >
          {footer}
        </Footer>
      </Layout>
    </Layout>
  );
};
