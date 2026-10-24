import * as _ from "lodash";
import { Scan } from "../components";

export   const orderScansByStartTime = (scans: Scan[]) =>
  _.orderBy(scans, ['startTime'], ['desc']);
