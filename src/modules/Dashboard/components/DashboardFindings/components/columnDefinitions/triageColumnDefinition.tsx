import * as _ from 'lodash';

export const triageColumnDefinition = () => ({
  title: 'Triaged',
  key: 'triaged',
  dataIndex: ['triaged'],
  sorter: (a, b) => a.triaged ?.localeCompare(b.triaged),
  render: (confidence: string) => _.startCase(confidence?.toLowerCase()),
});


