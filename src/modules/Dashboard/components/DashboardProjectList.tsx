import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import * as _ from 'lodash';
import { Menu, Progress } from 'antd';
import {
  CheckCircleOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import routes from '../../../constants/routes.json';
import { DateFormats } from '../../../constants/DateFormats';
import { formatDate } from '../../../utils';
import { Project, Scan } from './interfaces';
import { getProject, orderScansByStartTime } from '../utils';
// @ts-ignore
import styles from '@Src/General.css';

const { SubMenu } = Menu;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const DashboardProjectList = ({ projects, onDrop }) => {
  const history = useHistory();
  const { params } = useRouteMatch<{
    projectId: string;
    scanId: string;
  }>();
  const [openProjectId, setOpenProjectId] = React.useState('');
  const [openScanId, setOpenScanId] = React.useState('');
  const [reversedProjects, setReversedProjects] = React.useState<Project[]>([]);
  const [isDragOver, setDragOver] = React.useState(false);

  const isSelected = (key: string) => openProjectId === key;
  const FolderIcon = ({ currentKey }: { currentKey: string }) =>
    isSelected(currentKey) ? <FolderOpenOutlined /> : <FolderOutlined />;

  React.useEffect(() => {
    const project = getProject(projects, openProjectId);
    if (_.isEmpty(project)) {
      const firstProject = reversedProjects?.[0];
      if (firstProject) {
        const firstProjectId = firstProject.index.id;
        setOpenProjectId(firstProjectId);
        history.push(`${routes.DASHBOARD}/${firstProjectId}/${routes.SCAN}`);
      }
    }
  }, [reversedProjects]);

  React.useEffect(() => {
    setOpenProjectId(params.projectId);
    setOpenScanId(params.scanId);
  }, [params]);

  React.useEffect(() => {
    setReversedProjects(_.reverse([...projects]));
  }, [projects]);

  useDeepCompareEffect(() => {
    setReversedProjects(_.reverse([...projects]));
  }, [projects]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e.dataTransfer?.files?.[0]?.path);
        setDragOver(false);
      }}
      style={
        isDragOver
          ? {
              height: 'calc(100% - 100px)',
              border: '2px dashed #1e64bd',
              margin: '1em',
              color: '#1e64bd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }
          : {
              height: 'calc(100% - 100px)',
              border: '2px dashed transparent',
            }
      }
    >
      {isDragOver ? (
        'Drop file to open'
      ) : (
        <Menu
          theme="dark"
          mode="inline"
          openKeys={[openProjectId]}
          selectedKeys={[openScanId]}
        >
          {_.map(reversedProjects, (project: Project) => (
            <SubMenu
              key={project.index.id}
              icon={<FolderIcon currentKey={project.index.id} />}
              title={project.index.label}
              onTitleClick={() => {
                history.push(
                  `${routes.DASHBOARD}/${project.index.id}/${routes.SCAN}`
                );
              }}
            >
              {_.map(orderScansByStartTime(project.scans), (scan: Scan) => {
                if (openProjectId !== project.index.id) return null
                return (
                  <Menu.Item
                    key={scan.id}
                    className={styles.menuItem}
                    onClick={() => {
                      history.push(
                        `${routes.DASHBOARD}/${project.index.id}/${routes.SCAN}/${scan.id}`
                      );
                    }}
                    icon={
                      scan.progress ? (
                        <Progress
                          strokeWidth={10}
                          style={{ marginRight: 10 }}
                          showInfo={false}
                          type="circle"
                          percent={scan.progress}
                          width={14}
                          strokeColor="#52c41a"
                          trailColor={
                            openScanId === scan.id ? '#1890ff' : 'black'
                          }
                        />
                      ) : (
                        <CheckCircleOutlined />
                      )
                    }
                  >
                    <span>{scan?.options?.label || 'Scan generated on'}</span>
                    <span className={scan.progress && styles.activeScan}>
                      {scan.progress
                        ? `current scan: ${scan.progress}%`
                        : scan.endTime &&
                          formatDate(scan.endTime, DateFormats.dateAndTime)}
                    </span>
                  </Menu.Item>
                );
              })}
              
            </SubMenu>
          ))}
        </Menu>
      )}
    </div>
  );
};
