import { Scan } from "../components";
import { getProject } from './getProject';
import { orderScansByStartTime } from "./orderScansByStartTime";

export const getLatestScan = (
  projects: any,
  prjId: string
): Scan | undefined => {
  const scans = getProject(projects, prjId)?.scans;
  // @ts-ignore
  if (scans?.length > 0) return orderScansByStartTime(scans)[0];
  return undefined;
};
