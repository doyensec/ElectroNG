import * as _ from 'lodash';
import dayjs from 'dayjs';
import { Project } from '../interfaces';

const getRandomDate = () =>
  new Date(
    Date.UTC(
      _.random(2018, 2020),
      _.random(1, 12),
      _.random(1, 30),
      _.random(1, 24),
      _.random(1, 60),
      _.random(0, 60)
    )
  );

const subtractMinutes = (date: Date, minutes: number): Date =>
  dayjs(date).subtract(minutes, 'minutes').toDate();

const billingPanelScan1StartDate = subtractMinutes(new Date(), 40);
const billingPanelScan1Progress = 67;
const billingPanelScan2EndDate = getRandomDate();
const billingPanelScan2StartDate = subtractMinutes(
  billingPanelScan2EndDate,
  40
);

const generateScanTime = (durationInMinutes: number) => {
  const endTime = getRandomDate();
  return {
    endTime,
    startDate: subtractMinutes(endTime, durationInMinutes),
  };
};

export const projects: Project[] = [
  {
    id: 'billing-panel',
    name: 'Billing panel',
    getInProgress: () => ({
      startDate: billingPanelScan1StartDate,
      progress: billingPanelScan1Progress,
    }),
    scans: [
      {
        id: 'billing-panel-scan-1',
        name: 'Scan Today',
        startDate: billingPanelScan1StartDate,
        progress: billingPanelScan1Progress,
      },
      {
        id: 'billing-panel-scan-2',
        name: 'Scan Monday',
        ...generateScanTime(50),
      },
      {
        id: 'billing-panel-scan-3',
        name: 'Scan Friday',
        ...generateScanTime(60),
      },
      {
        id: 'billing-panel-scan-4',
        name: 'Scan Custom Name',
        ...generateScanTime(10),
      },
      {
        id: 'billing-panel-scan-5',
        name: 'Scan Thursday',
        ...generateScanTime(35),
      },
    ],
  },
  {
    id: 'admin-site',
    name: 'Admin site',
    getInProgress: () => null,
    scans: [
      {
        id: 'admin-site-scan-1',
        name: 'Scan Custom Name',
        ...generateScanTime(99),
      },
      {
        id: 'admin-site-scan-2',
        name: 'Scan Monday',
        ...generateScanTime(78),
      },
      {
        id: 'admin-site-scan-3',
        name: 'Scan Friday',
        ...generateScanTime(23),
      },
      {
        id: 'admin-site-scan-4',
        name: 'Scan Custom Name',
        ...generateScanTime(14),
      },
      {
        id: 'admin-site-scan-5',
        name: 'Scan Thursday',
        ...generateScanTime(20),
      },
    ],
  },
  {
    id: 'navigation-three',
    name: 'Navigation Three',
    getInProgress: () => null,
    scans: [
      {
        id: 'navigation-three-scan-1',
        name: 'Scan Custom Name',
        startDate: billingPanelScan2StartDate,
        endDate: billingPanelScan2EndDate,
      },
      {
        id: 'navigation-three-scan-2',
        name: 'Scan Monday',
        startDate: billingPanelScan2StartDate,
        endDate: billingPanelScan2EndDate,
      },
      {
        id: 'navigation-three-scan-3',
        name: 'Scan Friday',
        startDate: billingPanelScan2StartDate,
        endDate: billingPanelScan2EndDate,
      },
      {
        id: 'navigation-three-scan-4',
        name: 'Scan Custom Name',
        startDate: billingPanelScan2StartDate,
        endDate: billingPanelScan2EndDate,
      },
      {
        id: 'navigation-three-scan-5',
        name: 'Scan Thursday',
        startDate: billingPanelScan2StartDate,
        endDate: billingPanelScan2EndDate,
      },
    ],
  },
];
