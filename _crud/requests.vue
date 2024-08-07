<template></template>
<script>
//Components
import fileList from 'modules/qsite/_components/master/fileList'
export default {
  components: {fileList},
  data() {
    return {
      crudId: this.$uid(),
      listOfCategories: [],
    }
  },
  async mounted() {
    await this.getCategories();
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768;
    },
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qrequestable.entityNames.requestable"),
        apiRoute: 'apiRoutes.qrequestable.requestables',
        permission: 'requestable.requestables',
        extraFormFields: 'requestable.crud-fields.requestable',
        create: {
          title: this.$tr('requestable.cms.newRequest'),
          to: {name: 'qrequestable.main.requestables.create'}
        },
        read: {
          showAs: this.isMobile ? 'table' : 'kanban',
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', sortable: true, align: 'left'},
            {
              name: 'category', label: this.$tr('isite.cms.form.category'),
              align: 'left', field: 'category', sortable: true,
              format: val => ((val && val.title) ? val.title : '-')
            },
            {
              name: 'statusTitle', label: this.$tr('isite.cms.form.status'),
              align: 'left', field: 'status', sortable: true,
              format: val => ((val && val.title) ? val.title : '-')
            },
            {name: 'type', label: this.$tr('isite.cms.form.type'), field: 'type', align: 'left'},
            {
              name: 'requestedBy', label: this.$tr('isite.cms.form.requestedBy'), field: 'requestedBy',
              format: val => val ? `${val.firstName} ${val.lastName}` : '-', align: 'left'
            },
            {
              name: 'responsible', label: this.$tr('isite.cms.form.responsible'), field: 'responsible',
              format: val => val ? `${val.firstName} ${val.lastName}` : '-', align: 'left'
            },
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center'
            },
          ],
          requestParams: {
            include: 'category,status,fields,files,comments,responsible,requestedBy',
            filter: {}
          },
          kanban: {
                column: {
                  filter:{
                    name: 'categoryId'
                  },
                  apiRoute: 'apiRoutes.qrequestable.statuses',
                  include: 'category',
                },
                card: {
                  filter:{
                    name: 'statusId'
                  },
                  apiRoute: 'apiRoutes.qrequestable.requestables',
                  include: 'fields,responsible,status,requestedBy,category.forms.fields,conversation',
                },
                orderStatus: {
                  filter: {
                    name: 'category'
                  },
                  apiRoute: 'apiRoutes.qrequestable.orderStatus',
                },
                automation: {
                  filter:{
                    name: 'statusId'
                  },
                  apiRoute: 'apiRoutes.qrequestable.automationRule'
                },
          },
          filters: {
            sourceId: {
                value: null,
                type: 'crud',
                permission: 'requestable.requestables.filter-source',
                props: {
                  crudType: 'select',
                  crudData: import('modules/qrequestable/_crud/sources'),
                  crudProps: {
                    label: this.$tr('isite.cms.label.source'),
                    rules: [
                      val => !!val || this.$tr('isite.cms.message.fieldRequired')
                    ],
                    readonly: !this.$hasAccess(`requestable.sources.index`)
                  },
                  config: {
                    filterByQuery: true,
                    options: {
                      label: 'title', value: 'id',
                    }
                  }
              },
            },
            requestedById: {
              value: null,
              type: 'crud',
              permission: "requestable.requestables.filter-requested-by",
              props: {
                crudType: 'select',
                crudData: import('modules/quser/_crud/users'),
                crudProps: {
                  label: this.$tr('isite.cms.form.requestedBy'),
                },
                clearable: true,
                config: {
                  filterByQuery: true,
                  options: {
                    label: 'fullName', value: 'id'
                  }
                }
              },
            },
            responsibleId: {
              value: null,
              type: 'crud',
              permission: 'requestable.requestables.filter-responsible',
              props: {
                crudType: 'select',
                crudData: import('modules/quser/_crud/users'),
                crudProps: {
                  label: this.$tr('requestable.cms.label.responsible'),
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ],
                },
                config: {
                  filterByQuery: true,
                  options: {
                    label: 'fullName', value: 'id', img: 'mainImage'
                  }
                }
              },
            },
            categoryId: {
              value: null,
              type: 'select',
              quickFilter: !this.isMobile,
              label: this.$tr('requestable.cms.sidebar.categories'),
              props: {
                selectByDefault: true,
                label: `${this.$tr('requestable.cms.sidebar.categories')}`,
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qrequestable.categories',
                requestParams: {filter: {internal: false}}
              }
            },
            statusId: {
              value: null,
              type: 'select',
              permission: "requestable.requestables.filter-status",
              props: {
                label: `${this.$tr('isite.cms.form.status')}`,
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qrequestable.statuses',
                requestParams: {filter: {categoryId: this.crudInfo.categoryId}}
              }
            },
          },
          actions: [
            {
              name: 'viewEntity',
              icon: 'fas fa-eye',
              label: this.$tr('isite.cms.label.show'),
              format: (field) => {
                return (field.requestableUrl) ? {} : {vIf: false}
              },
              action: (item) => {
                if (item.requestableUrl) this.$helper.openExternalURL(item.requestableUrl)
              }
            },
            {
              name: 'viewLead',
              icon: 'fas fa-info-circle',
              color: 'info',
              tooltip: this.$tr('isite.cms.label.information'),
              format: (field) => {
                return (field.category && field.category.form) ? {} : {vIf: false}
              },
              action: (item) => {
                this.showRequestData(item)
              }
            }
          ],
        },
        update: false,
        delete: false,
        formLeft: {
          id: {value: ''},
          categoryId: {
            value: null,
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.category')}`,
              readonly: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qrequestable.categories'
            }
          },
          statusId: {
            value: null,
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.status')}`
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qrequestable.statuses',
              requestParams: {filter: {categoryId: this.crudInfo.categoryId}}
            }
          },
          createdBy: {
            value: null,
            type: 'crud',
            permission: 'requestable.requestables.edit-created-by',
            props: {
              crudType: 'select',
              crudData: import('modules/quser/_crud/users'),
              crudProps: {
                label: this.$tr('isite.cms.form.createdBy'),
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              config: {
                filterByQuery: true,
                options: {
                  label: 'fullName', value: 'id'
                }
              }
            },
          },
          requestedBy: {
            value: null,
            type: 'crud',
            permission: 'requestable.requestables.edit-requested-by',
            props: {
              crudType: 'select',
              crudData: import('modules/quser/_crud/users'),
              crudProps: {
                label: this.$tr('isite.cms.form.requestedBy'),
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              config: {
                filterByQuery: true,
                options: {
                  label: 'fullName', value: 'id'
                }
              }
            },
          }
          /*comment: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.comment')}`,
              type: 'textarea',
              rows: "3"
            },
          },*/
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    //Reset Modal
    async getCategories() {
      try {
        const response = await this.$crud.index('apiRoutes.qrequestable.categories');
        this.listOfCategories = response.data;
      } catch (error) {
        this.$apiResponse.handleError(error, () => {
          this.listOfCategories = [];
          console.log(error);
        })
      }
    }
  }
}
</script>
