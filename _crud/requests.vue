<template></template>
<script>
//Components
import fileList from '@imagina/qsite/_components/master/fileList'


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
          showAs: 'kanban',
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
                  include: 'fields,files,creator,requestedBy',
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
            /*requestedBy: {
              type: 'select',
              permission: "requestable.requestables.filter-created-by",
              props: {
                label: this.$tr('isite.cms.form.requestedBy'),
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                select: {label: 'fullName', id: 'id'},
              }
            },*/
            /*createdBy: {
              type: 'select',
              permission: "requestable.requestables.filter-requested-by",
              props: {
                label: this.$tr('isite.cms.label.creator'),
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                select: {label: 'fullName', id: 'id'},
              }
            },*/
            categoryId: {
              value: null,
              type: 'select',
              quickFilter: true,
              props: {
                selectByDefault: true,
                label: `${this.$tr('isite.cms.form.category')}`,
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qrequestable.categories',
                requestParams: {filter: {internal: false}}
              }
            },
            /*statusId: {
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
            },*/
          }
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
          requestedBy: {
            value: null,
            type: 'select',
            permission: "requestable.requestables.edit-requested-by",
            props: {
              label: this.$tr('isite.cms.form.createdBy'),
            },
            loadOptions: {
              apiRoute: "apiRoutes.quser.users",
              select: {label: 'fullName', id: 'id'},
              //filterByQuery: true
            }
          },
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
        this.listOfCategories = [];
        console.log(error);
      }
    }
  }
}
</script>