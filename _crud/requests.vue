<template>
  <div>    
    <infomation ref="modalInfortion"></infomation>
  </div>
</template>
<script>
//Components
import fileList from '@imagina/qsite/_components/master/fileList'
import infomation from '@imagina/qrequestable/_components/modals/infomation'

export default {
  components: {fileList, infomation},
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
              name: 'creator', label: this.$tr('isite.cms.form.createdBy'), field: 'creator',
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
                  include: 'category,status,fields,files,comments,creator,requestedBy',
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
          requestParams: {
            include: 'category,status,fields,files,comments,creator,requestedBy',
            filter: {}
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
                this.showModal(item)
              }
            }
          ],
          filters: {
            requestedBy: {
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
            },
            createdBy: {
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
            },
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
          }
        },
        update: {
          title: this.$tr('requestable.cms.updateRequest'),
          requestParams: {include: 'category'}
        },
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
          comment: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.comment')}`,
              type: 'textarea',
              rows: "3"
            },
          },
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
  methods: {
    //Fields to show
    async showModal(requestData) {
      this.$refs.modalInfortion.showRequestData(requestData);
    },
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