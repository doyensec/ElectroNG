import { BrowserWindow } from "electron";
// @ts-ignore
import { initiateScan } from "@doyensec/electrong-core/dist/core.js";
import _ from "lodash";

export const initializeScanHandler = (_window: BrowserWindow) => async (
  _event: any,
  options: any
) => {

  const scanObservable = initiateScan(options);

  scanObservable.subscribe(
    _.throttle((x: any) => {
      _event.sender.send('progress-update', x.progress);
    }, 1000),
    (err: any) => console.error("subscription error", err),
    async () => {
      _event.sender.send('progress-update', null);
      console.log("completed");
    }
  );
};