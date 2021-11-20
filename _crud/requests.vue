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
        entityName: config("main.qrequestable.entityNames.requestable"),
        apiRoute: 'apiRoutes.qrequestable.requestables',
        permission: 'requestable.requestables',
        extraFormFields: 'requestable.crud-fields.requestable',
        create: false,
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', sortable: true, align: 'left'},
            {
              name: 'category', label: this.$tr('ui.form.category'),
              align: 'left', field: 'category', sortable: true,
              format: val => ((val && val.title) ? val.title : '-')
            },
            {
              name: 'statusTitle', label: this.$tr('ui.form.status'),
              align: 'left', field: 'status', sortable: true,
              format: val => ((val && val.title) ? val.title : '-')
            },
            {name: 'type', label: this.$tr('ui.form.type'), field: 'type', align: 'left'},
            {
              name: 'createdAt', label: this.$tr('ui.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('ui.form.actions'), align: 'center'
            },
          ],
          requestParams: {include: 'category,status'},
          actions: [
            {
              icon: 'fas fa-eye',
              label: this.$tr('ui.label.show'),
              action: (item) => {
                if (item.requestableUrl) this.$helper.openExternalURL(item.requestableUrl)
              }
            }
          ]
        },
        update: {
          title: this.$tr('qrequestable.layout.updateRequest'),
          requestParams: {include: 'category'}
        },
        delete: false,
        formLeft: {
          id: {value: ''},
          categoryId: {
            value: null,
            type: 'select',
            props: {
              label: `${this.$tr('ui.form.category')}`,
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
              label: `${this.$tr('ui.form.status')}`
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qrequestable.statuses'
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
}
</script>
