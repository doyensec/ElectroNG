import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Layout, notification, Row } from 'antd';
import { ipcRenderer } from 'electron';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DoyProject from '@doyensec/electrong-core/dist/util/project';
import {
  getProject as getProjectsMeta,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line import/extensions
} from '@doyensec/electrong-core/dist/core.js';
import logoWithName from '../../../assets/logo/electroNg_white.svg';
import routes from '../../constants/routes.json';
import {
  DashboardEmptyNoProjects,
  DashboardFindingsView,
  DashboardHeader,
  DashboardNewScanModal,
  DashboardProjectList,
  DashboardScanStatsView,
  DashboardTitle,
  exportHandler,
  getHTMLDetailsForFinding,
  Project,
  Scan,
  ScanFinished,
  ScanInProgress,
} from './components';
import {
  getLatestScan,
  getMostFindings,
  getProjectAffectedFiles,
  getProjectMostFindings,
  getProjectSeverityStats,
  getScan,
  getSeverityStats,
  getTopAffectedFiles,
  openProject,
  openProjectModal,
  saveProjectHandler,
} from './utils';
import { DashboardNewProjectModal } from './components/DashboardNewProjectModal';
import { onDeleteHandler } from './utils/onDeleteHandler';
import { DashboardEmptyNoScans } from './components/DashboardEmptyNoScans';
import { getBrowserProperties } from './utils/getBrowserProperties';
import { getFileArtifact } from './utils/getStoredFileHandler';

const styles = require('./styles/DashboardView.css').default;

dayjs.extend(duration);
dayjs.extend(relativeTime);

const { Sider, Header, Content } = Layout;

export const DashboardView = (): JSX.Element => {
  const { path, params } = useRouteMatch<{
    projectId: string;
    scanId: string;
  }>();

  const [isExportModalVisible, setExportModalVisible] = useState(false);
  const [isNewScanModalVisible, setNewScanModalVisible] = useState(false);
  const [isNewProjectModalVisible, setNewProjectModalVisible] = useState(false);
  const [findingId, setFindingId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any>([]);
  const [
    runningScanStatus,
    setRunningScanStatus,
  ] = useState<ScanInProgress | null>(null);

  const [currentScanId, setCurrentScanId] = useState<string>();

  const DASHBOARD_DETAILS = `${path}/(${routes.SCAN}|${routes.FINDINGS})?/:scanId?`;
  const DASHBOARD_SCAN_DETAILS = `${path}/(${routes.SCAN})?/:scanId?`;
  const DASHBOARD_FINDINGS_DETAILS = `${path}/${routes.FINDINGS}/:scanId`;

  const updateProjectList = async () => {
    const lastProjects = await ipcRenderer.invoke('get-last-projects');
    try {
      if (lastProjects.length > 0) {
        const projectsMeta = await getProjectsMeta(lastProjects);
        const rejected = _.reject(lastProjects, (proj) => {
          return projectsMeta.errors.includes(proj.projectPath);
        });
        setProjects(projectsMeta.availableProjects);
        await ipcRenderer.send('overwrite-last-projects', rejected);
        if (projectsMeta.errors.length > 0)
          projectsMeta.errors.forEach((projectPath: string) =>
            notification.error({
              message: 'Problem with loading projects',
              description: `Could not locate the project path ("${projectPath}") on disk. Restore the project's previous location or open it again.`,
              duration: null,
            })
          );
      } else {
        setProjects([]);
      }
    } catch (e) {
      setProjects([]);
      notification.error({
        message: 'Problem with loading projects',
        description: e.message,
        duration: null,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const updateProgress = (progress) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setRunningScanStatus((current) => {
      return {
        ...current,
        progress: Number.parseFloat(progress),
      };
    });
  };

  useEffect(() => {
    // Fetch project list after Dashboard loaded
    updateProjectList();

    ipcRenderer.on('progress-update', (_event, progress) => {
      if (progress) {
        updateProgress(progress);
        if (Number.parseFloat(progress) > 99) {
          // We cannot rely on "complete" callback,
          // so we have to reset the progress 2s after getting a 100%
          setTimeout(() => {
            setRunningScanStatus(null);
            // Fetch project list after scan finisheds
            updateProjectList();
          }, 2000);
        }
      }
    });
  }, []);

  const startNewScan = async (
    selectedProjectId: string,
    scanLabel: string,
    customScan: string[],
    severitySet: string,
    confidenceSet: string
  ) => {
    const selectedProject = _.find(projects, ['index.id', selectedProjectId]);

    if (selectedProject) {
      await ipcRenderer.invoke('initialize-scan', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        label: scanLabel,
        input: selectedProject.index.lastKnownLocation,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        projectFile: selectedProject.projectPath,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        output: false,
        outputFileFormat: false,
        customScan,
        excludeFromScan: [],
        severitySet,
        confidenceSet,
        parserPlugins: [],
      });

      setRunningScanStatus({
        projectId: selectedProjectId,
        progress: 1,
        startTime: new Date(),
      });
    }
  };

  const noProjects = _.isEmpty(projects);

  const getScanDefaultLatest = (projectId: string, scanId: string) =>
    getScan(projects, projectId, scanId) || getLatestScan(projects, projectId);

  const getCurrentProject = (projectId: string) =>
    _.find<Project>(projects, ['index.id', projectId]);

  const getCurrentScan = (scans: Scan[] | undefined, scanId: string) =>
    _.find<Scan>(scans, ['id', scanId]);

  return (
    <Layout>
      <Sider className={styles.dashboardSider}>
        <Header className={styles.dashboardSiderHeader}>
          <img
            alt="logo"
            src={logoWithName as string}
            height={34}
            color="#fff"
            className={styles.dashboardSiderHeaderLogo}
          />
        </Header>
        <Route
          path={DASHBOARD_DETAILS}
          render={() => {
            return (
              <DashboardProjectList
                projects={projects}
                onDrop={async (filePath: string) => {
                  await openProject(filePath).catch((e) => {
                    notification.error({
                      message: 'File is not an .eng project',
                      description: e.message,
                      duration: null,
                    });
                  });
                  await updateProjectList();
                }}
              />
            );
          }}
        />
      </Sider>
      <Layout className={styles.dashboardContentLayout}>
        {noProjects ? null : (
          <DashboardHeader
            dashboardDetailsPath={DASHBOARD_DETAILS}
            onNewScan={() => setNewScanModalVisible(true)}
            onNewProject={() => setNewProjectModalVisible(true)}
            onExportReport={() => setExportModalVisible(true)}
            updateProjectList={updateProjectList}
            findingId={findingId}
            isModalVisible={isExportModalVisible}
            handleOk={exportHandler(projects, () => {
              setExportModalVisible(false);
              setFindingId(null);
            })}
            handleCancel={() => {
              setExportModalVisible(false);
              setFindingId(null);
            }}
          />
        )}
        <Content className={styles.dashboardContent}>
          <Route
            path={DASHBOARD_DETAILS}
            render={({
              match: {
                params: { projectId, scanId },
              },
              history,
            }) => {
              return (
                <>
                  {noProjects ? null : (
                    // TODO: isRunningScanSelected needs to be fixed
                    <DashboardTitle
                      isRunningScanSelected={
                        runningScanStatus?.scanId === scanId
                      }
                      projects={projects}
                      projectId={projectId}
                      scanId={scanId}
                      startTime={runningScanStatus?.startTime ?? null}
                      progress={runningScanStatus?.progress ?? null}
                      onDelete={onDeleteHandler(
                        projects,
                        projectId,
                        scanId,
                        updateProjectList
                      )}
                    />
                  )}
                  <DashboardNewScanModal
                    isModalVisible={isNewScanModalVisible}
                    handleOk={async (
                      scanLabel: string,
                      customScan: string[],
                      severitySet: string,
                      confidenceSet: string
                    ) => {
                      history.push(`${routes.DASHBOARD}/${params.projectId}/`);
                      setNewScanModalVisible(false);
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      await startNewScan(
                        params.projectId,
                        scanLabel,
                        customScan,
                        severitySet,
                        confidenceSet
                      );
                    }}
                    handleCancel={() => {
                      setNewScanModalVisible(false);
                    }}
                  />
                </>
              );
            }}
          />

          {noProjects ? (
            <DashboardEmptyNoProjects
              onNewProject={() => setNewProjectModalVisible(true)}
              onOpenProject={openProjectModal(updateProjectList)}
            />
          ) : (
            <div style={{ padding: '1.4em' }}>
              <Row gutter={[18, 18]}>
                <Switch>
                  <Route
                    exact
                    path={DASHBOARD_FINDINGS_DETAILS}
                    render={({
                      match: {
                        params: { projectId, scanId },
                      },
                    }) => {
                      const scanStats = getScanDefaultLatest(projectId, scanId);
                      const currentProject = getCurrentProject(projectId);
                      const currentScan = getCurrentScan(
                        currentProject?.scans,
                        scanId
                      );

                      // TODO: SEE https://flaviocopes.com/react-update-while-rendering-different-component/ to fix the warning "Cannot update a component (`DashboardView`) while rendering a different component"
                      setCurrentScanId(scanId);

                      return (
                        <DashboardFindingsView
                          findings={currentScan?.issues}
                          finishedStats={
                            scanStats?.endTime
                              ? (scanStats as ScanFinished)
                              : null
                          }
                          onExportDetails={(exportedFindingId: string) => {
                            setFindingId(exportedFindingId);
                            setExportModalVisible(true);
                          }}
                          onGetFindingDetails={async (
                            detailsFindingId: string
                          ) => {
                            return getHTMLDetailsForFinding(
                              /* projects, () => {}, */ detailsFindingId,
                              currentProject as Project,
                              currentScanId as string
                            );
                          }}
                          onSaveProject={saveProjectHandler(
                            currentScan as Scan,
                            currentProject as Project,
                            updateProjectList
                          )}
                          onGetStoredFile={(sha2: string) => {
                            try {
                              const result = getFileArtifact(
                                sha2,
                                currentProject as Project
                              );
                              if (result.length < 300000)
                                // 300000 chars is an arbitrary value. It avoids to preview too large file in the UI
                                return result;
                              return 'File is too large to be displayed';
                            } catch (e) {
                              notification.error({
                                message: 'Problem opening the file',
                                description: `${e}`,
                                duration: null,
                              });
                              return `${e}`;
                            }
                          }}
                        />
                      );
                    }}
                  />
                  <Route
                    path={DASHBOARD_SCAN_DETAILS}
                    render={({
                      match: {
                        params: { projectId, scanId },
                      },
                    }) => {
                      const scanStats = getScanDefaultLatest(projectId, scanId);
                      const currentProject = getCurrentProject(projectId);
                      const isScanSelected = !_.isNil(scanId);
                      const isScanAvailable = !_.isNil(scanStats);

                      if (!isScanAvailable) {
                        return (
                          <DashboardEmptyNoScans
                            onNewScan={() => setNewScanModalVisible(true)}
                          />
                        );
                      }

                      return (
                        <DashboardScanStatsView
                          isProjectSelected={
                            !_.isNil(projectId) && _.isEmpty(scanId)
                          }
                          isScanSelected={isScanSelected}
                          finishedStats={
                            scanStats?.endTime
                              ? (scanStats as ScanFinished)
                              : null
                          }
                          isLatestRunning={
                            projectId === runningScanStatus?.projectId
                          }
                          runningStats={runningScanStatus}
                          lastScanSeverityStats={getSeverityStats(
                            scanStats?.issues
                          )}
                          lastScanAffectedFiles={getTopAffectedFiles(
                            scanStats?.issues
                          )}
                          lastScanMostFindings={getMostFindings(
                            scanStats?.issues
                          )}
                          projectSeverityStats={getProjectSeverityStats(
                            currentProject
                          )}
                          projectAffectedFiles={getProjectAffectedFiles(
                            currentProject
                          )}
                          projectMostFindings={getProjectMostFindings(
                            currentProject
                          )}
                          browserProperties={getBrowserProperties(
                            scanStats?.decorators
                          )}
                        />
                      );
                    }}
                  />
                </Switch>
              </Row>
            </div>
          )}

          <DashboardNewProjectModal
            visible={isNewProjectModalVisible}
            onFinish={async (form) => {
              const projectPath = `${form.projectLocation}/${form.projectName}.eng`;
              const project = new DoyProject(projectPath);
              project.label = form.projectName;
              await project.initializeProject(form.applicationPath);
              await project.save();
              setNewProjectModalVisible(false);

              await ipcRenderer.send('save-last-project', {
                name: form.projectName,
                projectPath,
              });

              await updateProjectList();
            }}
            onCancel={() => setNewProjectModalVisible(false)}
          />
        </Content>
      </Layout>
    </Layout>
  );
};
