const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'qrequestable.sidebar.adminGroup',
    icon: 'fas fa-file-signature',
    children: [
      pages.mainqrequestable.requestables,
      pages.qrequestable.status,
      pages.qrequestable.categories
    ]
  }
]
