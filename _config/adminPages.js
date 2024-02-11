export default {
  categories: {
    permission: 'requestable.categories.manage',
    activated: true,
    authenticated: true,
    path: '/requestable/categories',
    name: 'qrequestable.admin.categories',
    crud: import('modules/qrequestable/_crud/categories'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'requestable.cms.sidebar.categories',
    icon: 'fal fa-layer-group',
    subHeader: {
      refresh: true,
    }
  },
  status: {
    permission: 'requestable.statuses.manage',
    activated: true,
    authenticated: true,
    path: '/requestable/status',
    name: 'qrequestable.admin.status',
    crud: import('modules/qrequestable/_crud/status'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'requestable.cms.sidebar.status',
    icon: 'fa-light fa-arrow-progress',
    subHeader: {
      refresh: true,
    }
  },
  sources: {
    permission: 'requestable.sources.manage',
    activated: true,
    authenticated: true,
    path: '/requestable/source',
    name: 'qrequestable.admin.sources',
    crud: import('modules/qrequestable/_crud/sources'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'requestable.cms.sidebar.sources',
    icon: 'fa-brands fa-osi',
    subHeader: {
      refresh: true,
    }
  },
}
