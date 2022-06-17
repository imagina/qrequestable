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
        apiRoute: 'apiRoutes.qrequestable.categories',
        permission: 'requestable.requestables',
        extraFormFields: 'requestable.crud-fields.status',
        create: {
          title: this.$tr('requestable.cms.newCategory'),
          method: () => {
            console.warn(">>>>>>>>>> Creating...")
          }
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', sortable: true, align: 'left'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left', sortable: true},
            {name: 'type', label: this.$tr('isite.cms.form.type'), field: 'type', align: 'left', sortable: true},
            {
              name: 'timeElapsedToCancel',
              label: this.$tr('requestable.cms.timeElapsedToCancel'),
              field: 'timeElapsedToCancel',
              align: 'left',
              sortable: true,
              format: val => val ? `${val} ${this.$trp('isite.cms.label.minute')}` : "-"
            },
            {
              name: 'internal',
              label: this.$tr('isite.cms.label.internal'),
              field: 'internal',
              align: 'left',
              format: val => this.$tr('isite.cms.label.' + (val ? "yes" : "no"))
            },
            {
              name: 'statuses',
              label: this.$trp('isite.cms.form.status'),
              align: 'left',
              field: 'statuses',
              sortable: true,
              classes: 'ellipsis',
              style: 'max-width : 250px',
              format: val => val ? val.map(item => item.title.toLowerCase()).join(', ') : ''
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
            include: "statuses"
          },
          filters: {}
        },
        update: {
          title: this.$tr('requestable.cms.updateCategory'),
          method: () => {
            console.warn(">>>>>>>>>> Updating...")
          }
        },
        delete: true,
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
          type: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.type')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          timeElapsedToCancel: {
            value: '',
            type: 'input',
            props: {
              type: 'number',
              label: `${this.$tr('requestable.cms.timeElapsedToCancel')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          requestableType: {
            value: null,
            type: 'input',
            permission: 'requestable.categories.edit-requestable-type',
            props: {
              label: `${this.$tr('requestable.cms.requestableType')}`
            }
          },
          internal: {
            value: 0,
            type: 'select',
            permission: 'requestable.categories.edit-internal',
            props: {
              label: `${this.$tr('isite.cms.label.internal')}`,
              options: [
                {label: this.$tr('isite.cms.label.yes'), value: 1},
                {label: this.$tr('isite.cms.label.no'), value: 0},
              ]
            },
          },
          events: {
            value: 0,
            type: 'json',
            permission: 'requestable.categories.edit-events',
            props: {
              label: `${this.$trp('isite.cms.form.event')}`,
            },
          }
        }
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
