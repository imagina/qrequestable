<template></template>
<script>
//Component
import crud from '@imagina/qcrud/_components/crud'

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
        // entityName: config("main.qblog.entityNames.category"),
        apiRoute: 'apiRoutes.qrequestable.categories',
        permission: 'requestable.categories',
        extraFormFields: 'requestable.crud-fields.categories',
        create: {
          title: this.$tr('qrequestable.layout.newCategory'),
        },
        read: {
          columns: [
            { name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px' },
            { name: 'name', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth' },
            { name: 'timeElapsedToCancel', label: this.$tr('qrequestable.layout.timeElapsedToCancel'), field: 'timeElapsedToCancel', align: 'left' },
            { name: 'status', label: this.$tr('ui.form.status'), field: 'status', align: 'left' },
            {
              name: 'parent', label: this.$tr('ui.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            { name: 'actions', label: this.$tr('ui.form.actions'), align: 'left' },
          ],
          requestParams: {},
          filters: {
          }
        },
        update: {
          title: this.$tr('qrequestable.layout.updateCategory'),
          requestParams: {}
        },
        delete: true,
        formLeft: {
          userId: { value: this.$store.state.quserAuth.userId },
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.title')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
          },
          description: {
            value: '',
            type: 'html',
            isTranslatable: true,
            props: {
              label: `${this.$tr('ui.form.description')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          status: {
            value: '1',
            type: 'select',
            isTranslatable: false,
            props: {
              label: `${this.$tr('ui.form.status')}*`,
              options: [
                { label: this.$tr('ui.label.enabled'), value: '1' },
                { label: this.$tr('ui.label.disabled'), value: '0' }
              ],
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          useDefaultStatuses: {
            value: '1',
            type: 'select',
            isTranslatable: false,
            props: {
              label: `${this.$tr('qrequestable.layout.form.useDefaultStatuses')}*`,
              options: [
                { label: this.$tr('ui.label.enabled'), value: '1' },
                { label: this.$tr('ui.label.disabled'), value: '0' }
              ],
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          timeElapseToCancel: {
            value: 0,
            type: 'input',
            props: {
              label: this.$tr('qrequestable.layout.timeElapsedToCancel'),
              type: 'number',
              rules: [
                val => val >= 0 || this.$tr('ui.message.fieldMinValue', { num: 0 })
              ],
            }
          }
        },
        formRight: {
          formId: {
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qform/_crud/crudForms'),
              crudProps: {
                label: `${this.$tr('ui.label.form')}`,
              },
              config: {
                options: {
                  label: 'title', value: 'id'
                }
              },
            },
          },
          internal: {
            value: '0',
            type: 'select',
            isTranslatable: false,
            props: {
              label: `${this.$tr('ui.label.internal')}*`,
              options: [
                { label: this.$tr('ui.label.yes'), value: '1' },
                { label: this.$tr('ui.label.no'), value: '0' }
              ],
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
          requestableType: {
            value: '',
            type: 'input',
            props: {
              label: this.$tr('qrequestable.layout.form.requestableType')
            }
          },
          defaultStatus: {
            value: 0,
            type: 'input',
            props: {
              label: this.$tr('qrequestable.layout.form.defaultStatus'),
              type: 'number',
              rules: [
                val => val >= 0 || this.$tr('ui.message.fieldMinValue', { num: 0 })
              ],
            }
          },
          etaEvent: {
            value: '',
            type: 'input',
            props: {
              label: this.$tr('qrequestable.layout.form.etaEvent')
            }
          },
          statusToSetWhenElapsedTime: {
            value: 0,
            type: 'input',
            props: {
              label: this.$tr('qrequestable.layout.form.statusToSetWhenElapsedTime'),
              type: 'number',
              rules: [
                val => val >= 0 || this.$tr('ui.message.fieldMinValue', { num: 0 })
              ],
            }
          },
          events: {
            value: {},
            type: 'json',
            props: {
              label: this.$tr('ui.label.event')
            }
          },
          deleteRequestWhenStatus: {
            value: {},
            type: 'json',
            props: {
              label: this.$tr('qrequestable.layout.form.deleteRequestWhenStatus')
            }
          },
          eventsWhenStatus: {
            value: {},
            type: 'json',
            props: {
              label: this.$tr('qrequestable.layout.form.eventsWhenStatus')
            }
          }


        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
