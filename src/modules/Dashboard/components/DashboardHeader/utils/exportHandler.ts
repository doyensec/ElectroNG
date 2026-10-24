import _ from 'lodash';
import { GenerateReportOptions, Project } from "../../interfaces";
import { ipcRenderer } from 'electron';

export const exportHandler = (
  projects: Project[],
  onReportDone: () => void
) => (match: any) => async (options: GenerateReportOptions, findingId: string | null) => {
  const currentProject = _.find<Project>(projects, [
    'index.id',
    match?.params?.projectId,
  ]);

  let report;
  if(findingId) {
    report = await currentProject?._generateReportForFinding(
      match?.params?.scanId,
      findingId,
      options
    );
  } else {
    // eslint-disable-next-line no-underscore-dangle
    report = await currentProject?._generateReport(
      match?.params?.scanId,
      options
    );
  }

  if (report) {
    try {
      if (options.outputFileFormat === 'pdf') {
        await ipcRenderer.send('create-pdf', {
          path: options.outputPath,
          html: report,
        });
      } else if (options.outputFileFormat === 'html') {
        await ipcRenderer.send('save-file', {
          path: options.outputPath,
          html: report,
        });
      }
    } catch (e) {
      // it would be better to display some sort of dialog window instead of this log
      console.log('ipcRenderer.send error', e);
    }
  }

  onReportDone();
};



export async function getHTMLDetailsForFinding(/*projects: Project[], onReportDone: () => void,*/ findingId: string, currentProject: Project,
currentScan: string): Promise<string> {

  if(findingId) {
    const reportd = currentProject?._generateDetailsViewForFinding(
      currentScan,
      findingId,
      {
        outputFileFormat: 'html'
      }
    )
    return reportd;
  }

  
  return new Promise((resolve) => {
    resolve('No finding ID')
  })

};