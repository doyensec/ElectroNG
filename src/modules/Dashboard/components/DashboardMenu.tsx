import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import {
  DownOutlined,
  ExportOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import routes from '../../../constants/routes.json';
import { openProjectModal } from "../utils";
import styles from '@Src/General.css';

export interface MenuInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

export interface DashboardMenuProps {
  showScanRelatedItem: boolean;
  onNewScan: (info: MenuInfo) => void;
  onNewProject: (info: MenuInfo) => void;
  onExportReport: (info: MenuInfo) => void;
  updateProjectList: () => void;
}

interface Params {
  projectId: string;
  scanId: string;
}

export const DashboardMenu = ({
  showScanRelatedItem,
  onNewScan,
  onNewProject,
  onExportReport,
  updateProjectList,
}: DashboardMenuProps) => {
  const { params } = useRouteMatch<Params>();
  const location = useLocation();

  const DASHBOARD_SCAN = `/dashboard/${params.projectId}/${routes.SCAN}/${params.scanId}`;
  const DASHBOARD_FINDINGS = `/dashboard/${params.projectId}/${routes.FINDINGS}/${params.scanId}`;

  const menu = (
    <Menu onClick={() => {}}>
      <Menu.Item key="1" onClick={onNewScan}>
        New scan
      </Menu.Item>
      <Menu.Item key="2" onClick={onNewProject}>
        New project
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Menu
        selectedKeys={[location.pathname]}
        mode="horizontal"
        style={{ width: 'calc( 100% - 312px )', display: 'inline-block' }}
      >
        {showScanRelatedItem && (
          <>
            <Menu.Item key={DASHBOARD_SCAN}>
              <Link to={DASHBOARD_SCAN}>Scan</Link>
            </Menu.Item>
            <Menu.Item key={DASHBOARD_FINDINGS}>
              <Link to={DASHBOARD_FINDINGS}>Findings</Link>
            </Menu.Item>
            <span className={styles.divider} />
          </>
        )}

        <Menu.Item
          key="open"
          icon={<FolderOpenOutlined />}
          onClick={openProjectModal(updateProjectList)}
        >
          Open project
        </Menu.Item>
        {/* {showSaveProject && ( */}
        {/*   <Menu.Item key="save" icon={<DownloadOutlined />}> */}
        {/*     Save project */}
        {/*   </Menu.Item> */}
        {/* )} */}

        {showScanRelatedItem && (
          <Menu.Item
            key="export"
            icon={<ExportOutlined />}
            onClick={onExportReport}
          >
            Export report
          </Menu.Item>
        )}
        {/* <Menu.Item key="option" icon={<SettingOutlined />}> */}
        {/*   Option */}
        {/* </Menu.Item> */}
      </Menu>
      <Dropdown overlay={menu}>
        <Button
          type="primary"
        >
          New <DownOutlined />
        </Button>
      </Dropdown>
    </>
  );
};
