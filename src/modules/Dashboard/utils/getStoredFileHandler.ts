import _ from 'lodash';
import { Project} from '../components';


export function getFileArtifact(sha2: string, currentProject: Project): string {
  
  if(sha2) {
    const reportd = currentProject?.getFileArtifact(sha2)
    return reportd;
  }

  else {
    return "No valid sha2 found."
  }
};