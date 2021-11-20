export default {
  requestable: {
    permission: 'requestable.requestables.manage',
    activated: true,
    authenticated: true,
    path: '/requestable/index',
    name: 'qrequestable.admin.requestables',
    crud: import('@imagina/qrequestable/_crud/requests'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qrequestable.sidebar.adminRequestable',
    icon: 'fas fa-file-signature',
    subHeader: {
      refresh: true,
    }
  }
}
