<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qrequestable.sources',
        permission: 'requestable.sources',
        create: {
          title: this.$tr('requestable.cms.newSource')
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', sortable: true, align: 'left'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left', sortable: true},
            {name: 'description', label: this.$tr('isite.cms.form.description'), field: 'description', align: 'left', sortable: true},
            {
              name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status',
              align: 'left',
              asStatus: true
            },
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center'
            }
          ],
          filters: {},
          requestParams: {
            include: 'users',
          },
        },
        update: {
          title: this.$tr('requestable.cms.updateSource'),
          requestParams: {
            include: 'users',
          },
        },
        formLeft: {
          id: {value: ''},
          title: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          description: {
            value: null,
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.description')}*`,
            },
          },
          status: {
              value: null,
              type: 'select',
              props: {
                label: `${this.$tr('isite.cms.form.status')}:`,
                options: [
                  {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                  {label: this.$tr('isite.cms.label.disabled'), value: '0'},
                ],
                clearable: true
              }
          },
          parentId: {
              value: null,
              type: 'treeSelect',
              props: {
                label: this.$tr('isite.cms.form.parent')
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qrequestable.sources',
                requestParams: {filter: {status: 1}}
              }
          },
          users: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('modules/quser/_crud/users'),
              crudProps: {
                label: this.$trp('iprofile.cms.sidebar.adminGroup'),
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                multiple: true,
                useChips: true,
              },
              config: {
                filterByQuery: true,
                options: {
                  label: 'fullName', value: 'id',
                }
              }
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
  methods: {}
}
</script>
