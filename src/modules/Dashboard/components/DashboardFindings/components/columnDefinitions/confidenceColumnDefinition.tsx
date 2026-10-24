import * as _ from 'lodash';

export const confidenceColumnDefinition = () => ({
  title: 'Confidence',
  key: 'confidence',
  dataIndex: ['confidence'],
  sorter: (a, b) => a.confidence?.localeCompare(b.confidence),
  render: (confidence: string) => _.startCase(confidence?.toLowerCase()),
});
