export default {
  requestables: {
    permission: 'requestable.requestables.manage',
    activated: true,
    authenticated: true,
    path: '/requestable/index',
    name: 'qrequestable.main.requestables',
    crud: import('@imagina/qrequestable/_crud/requests'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qrequestable.sidebar.mainRequestable',
    icon: 'fas fa-file-signature',
    subHeader: {
      refresh: true,
    }
  },
  newRequestable: {
    permission: 'requestable.requestables.create',
    activated: true,
    authenticated: true,
    path: '/requestable/create',
    name: 'qrequestable.main.requestables.create',
    page: () => import('@imagina/qrequestable/_pages/main/formRequest'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qrequestable.sidebar.mainRequestableCreate',
    icon: 'fas fa-file-signature',
    subHeader: {
      refresh: true,
      breadcrumb : ['mainqrequestable.requestables']
    }
  }
}
