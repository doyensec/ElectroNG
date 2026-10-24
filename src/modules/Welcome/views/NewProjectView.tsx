import React from 'react';
import { Button, Checkbox, Form } from 'antd';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Project from '@doyensec/electrong-core/dist/util/project';
import routes from '../../../constants/routes.json';
import { FooterLayout, WelcomeLayout } from './components';
import { NewProjectForm } from '../../components/NewProjectForm';


import styles from '@Modules/Welcome/styles/WelcomeContent.css';
import footerStyles from '@Modules/Welcome/styles/FooterLayout.css';

export const NewProjectView = () => (
  <WelcomeLayout
    content={
      <div
        className={styles.containerCentered}
        style={{ width: '65%', marginTop: 24 }}
      >
        <NewProjectForm
          onFinish={async (form) => {
            const projectPath = `${form.projectLocation}/${form.projectName}.eng`;
            const project = new Project(projectPath);
            project.label = form.projectName;
            await project.initializeProject(form.applicationPath);
            await project.save();

            try {
              await ipcRenderer.send('save-last-project', {
                name: form.projectName,
                projectPath,
              });
              ipcRenderer.send('create-new-window', '/dashboard/scan');
            } catch (e) {}
          }}
        />
      </div>
    }
    footer={
      <FooterLayout
        left={
          <Checkbox style={{ verticalAlign: 'sub' }}>
            Save empty project
          </Checkbox>
        }
        right={
          <>
            <Button type="text">
              <Link to={routes.SPLASHSCREEN}>Cancel</Link>
            </Button>
            <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
              <Button
                form="newProjectForm"
                type="primary"
                htmlType="submit"
                className={footerStyles.mainButton}
              >
                Create
              </Button>
            </Form.Item>
          </>
        }
      />
    }
  />
);
