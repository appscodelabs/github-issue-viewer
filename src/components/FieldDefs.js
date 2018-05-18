export default [
  /*
  {
    name: '__sequence',
    title: '#',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
  },
 */
  'id',
  /*
  {
    name: 'title',
    callback: 'handleTitle|url',
  },
 */
  {
    name: '__slot:titlelink',
    title: 'Title',
  },
  {
    name: 'created_at',
    title: 'Created At',
    sortField: 'created_at',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
  },
/*
  {
    name: 'age',
    sortField: 'age',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
  },
  {
    name: 'salary',
    sortField: 'salary',
    titleClass: 'center aligned',
    dataClass: 'right aligned',
    callback: 'handleSalary',
    direction: 'des',
  },
  {
    name: '__component:custom-actions',
    title: 'Actions',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
  },
 */
];
