import React from 'react';
import { RunUpgradeChecks } from './components/RunUpgradeChecks';
import { DefaultTableDropdown } from './components/DefaultTableDropdown';

const electronVersions = require('./constants/electron_versions.json');

const confidenceLevels = ['Certain', 'Firm', 'Tentative'];
export const severityLevels = ['Informational', 'High', 'Medium', 'Low'];

const SELECT_ELECTRON_VERSION_PLACEHOLDER = 'Detect version automatically';

export const scanSettingsOptions = (
  onElectronVersionChange: (value: React.SetStateAction<string>) => void,
  setRunUpgradeChecks: (value: React.SetStateAction<string>) => void,
  onSeverityChange: (value: React.SetStateAction<string>) => void,
  onConfidenceChange: (value: React.SetStateAction<string>) => void
) => [
  {
    key: '1',
    name: (
      <DefaultTableDropdown
        label="Electron version of targeted application"
        placeholder={SELECT_ELECTRON_VERSION_PLACEHOLDER}
        options={electronVersions}
        onChange={onElectronVersionChange as any}
      />
    ),
  },
  {
    key: '2',
    name: (
      <RunUpgradeChecks
        placeholder={SELECT_ELECTRON_VERSION_PLACEHOLDER}
        options={electronVersions}
        onChange={setRunUpgradeChecks as any}
      />
    ),
  },
  {
    key: '3',
    name: (
      <DefaultTableDropdown
        label="Minimum confidence level"
        placeholder="Select confidence level"
        options={confidenceLevels}
        onChange={onConfidenceChange as any}
        defaultValue={'Tentative'}
      />
    ),
  },
  {
    key: '4',
    name: (
      <DefaultTableDropdown
        label="Minimum severity level"
        placeholder="Select severity level"
        options={severityLevels}
        onChange={onSeverityChange as any}
        defaultValue={'Informational'}
      />
    ),
  },
];
