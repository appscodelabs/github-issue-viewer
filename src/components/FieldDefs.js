export default [
  {
    name: '__sequence',
    title: '#',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
  },
  {
    name: '__checkbox',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
  },
  'name', 'email', 'birthdate',
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
];
