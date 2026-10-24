import React from 'react';
import { Route } from 'react-router-dom';
import { DashboardMenu, DashboardMenuProps } from '../DashboardMenu';
import { DashboardExport, DashboardExportProps } from '../DashboardExport';
import { Header } from 'antd/es/layout/layout';
import { GenerateReportOptions } from "../interfaces";
import styles from '@Modules/Dashboard/styles/DashboardView.css';

interface DashboardHeaderProps
  extends Omit<DashboardMenuProps, 'showScanRelatedItem'>,
    DashboardExportProps {
  dashboardDetailsPath: string;
  handleOk: (match: any) => (options: GenerateReportOptions, findingId: string | null) => void;
}

export const DashboardHeader = ({
  dashboardDetailsPath,
  onNewScan,
  onNewProject,
  onExportReport,
  updateProjectList,
  findingId,
  isModalVisible,
  handleOk,
  handleCancel,
}: DashboardHeaderProps) => (
  <Header className={styles.dashboardContentMenu}>
    <Route
      path={dashboardDetailsPath}
      render={({ match }) => (
        <>
          <DashboardMenu
            showScanRelatedItem={match?.params?.scanId}
            onNewScan={onNewScan}
            onNewProject={onNewProject}
            onExportReport={onExportReport}
            updateProjectList={updateProjectList}
          />
          <DashboardExport
            findingId={findingId}
            isModalVisible={isModalVisible}
            handleOk={handleOk(match)}
            handleCancel={handleCancel}
          />
        </>
      )}
    />
  </Header>
);
