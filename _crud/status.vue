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
        entityName: config("main.qrequestable.entityNames.status"),
        apiRoute: 'apiRoutes.qrequestable.statuses',
        permission: 'requestable.requestables',
        extraFormFields: 'requestable.crud-fields.status',
        create: {
          title: this.$tr('requestable.cms.newStatus')
        },
        read: {
          showAs: (config('app.mode') == 'iadmin') ? 'table' : 'grid',
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', sortable: true, align: 'left'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left', sortable: true},
            //{name: 'value', label: this.$tr('isite.cms.label.value'), field: 'value', align: 'left', sortable: true},
            {
              name: 'category', label: this.$tr('isite.cms.form.category'),
              align: 'left', field: 'category', sortable: true,
              format: val => ((val && val.title) ? val.title : '-')
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
          requestParams: {
            include: 'category'
          },
          filters: {
            categoryId: {
              value: null,
              type: 'select',
              props: {
                label: `${this.$tr('isite.cms.form.category')}`,
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qrequestable.categories'
              }
            }
          }
        },
        update: {
          title: this.$tr('requestable.cms.updateStatus'),
          requestParams: {include: 'category'}
        },
        delete: false,
        formLeft: {
          id: {value: ''},
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          categoryId: {
            value: null,
            type: 'select',
            props: {
              label: `${this.$tr('isite.cms.form.category')}`
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qrequestable.categories'
            }
          },
          color: {
            value: '',
            type: 'inputColor',
            props: {
              label: `${this.$tr('isite.cms.label.color')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          default: {
            value: '0',
            type: 'select',
            required: true,
            props: {
              label: this.$tr('isite.cms.form.default'),
              options: [
                {label: this.$tr('isite.cms.label.yes'), value: '1'},
                {label: this.$tr('isite.cms.label.no'), value: '0'},
              ]
            },
          }
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
