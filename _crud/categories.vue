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
        extraFormFields: 'requestable.crud-fields.categories',
        create: {
          title: this.$tr('requestable.cms.newCategory')
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
          },
          internal: {
            value: 0,
          },
          formId: {
            value: null,
            type: 'select',
            required : false,
            props: {
              label: `${this.$tr('isite.cms.label.form')}`,
              hint: `${this.$tr('requestable.cms.hints.categoryFormField')}`,
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qform.forms',
              select: {label: 'title', id: 'id'}
            }
          },
        },
        getDataForm: (formData, type) => {
          return new Promise(resolve => {
            if (type == 'create') {
              //Add system name
              const title = formData.es.title;
              formData.type = this.$helper.getSlug(title || '');
            }
            //Resolve
            resolve(formData)
          })
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
