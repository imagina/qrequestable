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
  categories: {
    permission: 'requestable.categories.manage',
    activated: true,
    authenticated: true,
    path: '/requestable/categories',
    name: 'qrequestable.admin.categories',
    crud: import('@imagina/qrequestable/_crud/categories'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qrequestable.sidebar.adminCategories',
    icon: 'fas fa-layer-group',
    subHeader: {
      refresh: true,
    }
  }
  
}
