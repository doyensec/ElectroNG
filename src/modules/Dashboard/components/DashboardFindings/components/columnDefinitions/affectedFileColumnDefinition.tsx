export const affectedFileColumnDefinition = () => ({
  title: 'Affected file name',
  key: 'file',
  dataIndex: ['file'],
  sorter: (a, b) => a.file.localeCompare(b.file),
  render: (file: string) => file.split('/').splice(-2).join('/'),
});
