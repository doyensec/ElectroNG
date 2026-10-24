import React from 'react';
import { ipcRenderer, shell } from 'electron';
import { Button } from 'antd';
import { FolderOpenOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from '@Modules/Welcome/styles/WelcomeContent.css';
import footerStyles from '@Modules/Welcome/styles/FooterLayout.css';
import { FooterLayout, WelcomeLayout } from './components';
import logo from '../../../../assets/logo/electroNg_dark.svg';
import routes from '../../../constants/routes.json';

export const SplashscreenView = () => {
  const handleHelpOpenExternal = () => {
    shell.openExternal('https://get-electrong.com/docs/index.html#/');
  };

  return (
    <WelcomeLayout
      content={
        <div className={styles.containerBackground}>
          <div className={styles.containerCentered}>
            <img alt="ElectroNG" src={logo as string} height={70} width={305} />
          </div>
          <div className={styles.versionAndUpdate}>
            Version {process.env.ELECTRONG_VERSION}
          </div>
        </div>
      }
      footer={
        <FooterLayout
          left={
            <Button onClick={handleHelpOpenExternal} type="text">
              Get help
            </Button>
          }
          right={
            <>
              <Link to={routes.NEW_PROJECT}>
                <Button type="text" icon={<PlusOutlined />}>
                  New project
                </Button>
              </Link>
              <Button
                type="text"
                icon={<FolderOpenOutlined />}
                onClick={async () => {
                  const engFile: string = await ipcRenderer.invoke(
                    `get-file-path`
                  );

                  await ipcRenderer.send('save-last-project', {
                    name: engFile.split('/').splice(-1)[0].replace('.eng', ''),
                    projectPath: engFile,
                  });

                  ipcRenderer.send('create-new-window', '/dashboard/scan');
                }}
              >
                Open scan
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  ipcRenderer.send('create-new-window', '/dashboard/scan');
                }}
                className={footerStyles.mainButton}
              >
                Start
              </Button>
            </>
          }
        />
      }
    />
  );
};
