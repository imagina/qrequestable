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
          title: this.$tr('requestable.cms.create')
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', sortable: true, align: 'left'},
            {name: 'title', label: this.$tr('isite.cms.form.title'), field: 'title', align: 'left', sortable: true},
            {name: 'description', label: this.$tr('isite.cms.form.description'), field: 'description', align: 'left', sortable: true},
            {
              name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status',
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
          filters: {}
        },
        update: {
          title: this.$tr('requestable.cms.sources.update'),
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
