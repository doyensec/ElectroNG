export const titleColumnDefinition = () => ({
  title: 'Finding title',
  key: 'title',
  dataIndex: ['title'],
  sorter: (a, b) => a.title.localeCompare(b.title),
});
