export default {
  status: {
    permission: 'requestable.statuses.manage',
    activated: true,
    authenticated: true,
    path: '/requestable/status',
    name: 'qrequestable.admin.status',
    crud: import('@imagina/qrequestable/_crud/status'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qrequestable.sidebar.status',
    icon: 'fas fa-flag',
    subHeader: {
      refresh: true,
    }
  },
}
