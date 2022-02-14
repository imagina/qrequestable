<template>
  <master-modal v-model="modal.show" @hide="resetModal()" :loading="modal.loading"
                :title="modal.title" custom-position>
    <div class="box">
      <!--Tabs panel-->
      <q-tabs v-model="modal.tab" dense class="text-grey" active-color="primary" indicator-color="primary"
              align="justify" narrow-indicator>
        <q-tab name="comments" :label="$trp('isite.cms.label.comment')"/>
        <q-tab name="form" :label="$tr('isite.cms.label.form')"/>
      </q-tabs>
      <q-separator/>
      <!--Tabs panel-->
      <q-tab-panels v-model="modal.tab" animated>
        <!--Comments Tab-->
        <q-tab-panel name="comments">
          <q-list separator dense>
            <q-item v-for="(item, itemKey) in modal.comments" :key="itemKey" style="padding: 8px 0">
              <q-item-section>
                <q-item-label>{{ item.comment }}</q-item-label>
                <q-item-label caption>{{ $trd(item.createdAt) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
        <!--Form Tab-->
        <q-tab-panel name="form">
          <q-list separator dense>
            <q-item v-for="(item, itemKey) in modal.requestData" :key="itemKey" style="padding: 8px 0">
              <q-item-section>
                <q-item-label v-if="item.fieldType != 'media'">{{ item.label }}</q-item-label>
                <!--File preview-->
                <q-item-label v-if="item.fieldType == 'media'">
                  <file-list v-model="item.value" grid-col-class="col-12" hide-header/>
                </q-item-label>
                <!--value-->
                <q-item-label v-else caption>{{ item.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </master-modal>
</template>
<script>
//Components
import fileList from '@imagina/qsite/_components/master/fileList'

export default {
  components: {fileList},
  data() {
    return {
      crudId: this.$uid(),
      modal: {
        title: null,
        show: false,
        loading: false,
        requestData: [],
        tab: 'comments'
      }
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
        create: {
          title: this.$tr('requestable.cms.newRequest'),
          to: {name: 'qrequestable.main.requestables.create'}
        },
        read: {
          showAs: (config('app.mode') == 'iadmin') ? 'table' : 'grid',
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
          requestParams: {
            include: 'category,status,fields,files,comments,creator',
            filter: (config('app.mode') == 'iadmin') ? {} : {
              createdBy: this.$store.state.quserAuth.userId
            }
          },
          actions: [
            {
              name: 'viewEntity',
              icon: 'fas fa-eye',
              label: this.$tr('isite.cms.label.show'),
              format: (field) => {
                return (field.row.requestableUrl) ? {} : {vIf: false}
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
                return (field.row.category && field.row.category.form) ? {} : {vIf: false}
              },
              action: (item) => {
                this.showRequestData(item)
              }
            }
          ]
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
    async showRequestData(requestData) {
      //Set modal data
      this.modal = {
        title: requestData.category.title,
        show: true,
        loading: true,
        requestData: [],
        tab: 'comments',
        comments: requestData.comments || []
      }

      //Get form data
      let form = requestData.category?.form || false

      //Merge values
      if (form) {
        //Get field values
        let requestValues = {}
        requestData.fields.forEach(item => requestValues[item.name] = item.value)
        //get files
        let files = this.$clone(requestData.files || [])
        //Request data
        let requestFormParams = {refresh: true, params: {include: 'fields'}}
        //Get form
        this.$crud.show('apiRoutes.qform.forms', form.id, requestFormParams).then(response => {
          this.$clone(response.data.fields).forEach(field => {
            let fieldType = field.dynamicField?.type || 'input'//get field type
            let fieldValue = requestValues[this.$helper.convertStringToSnakeCase(field.name)] || '-'//get field value
            //Get field file
            let fieldFile = (fieldType != 'media') ? null :
                files.find(item => item.zone == (field.dynamicField.props.zone || 'mainimage'))

            //Add extra data to field
            this.modal.requestData.push({
              ...field,
              label: field.label.replace('*', ''),
              value: (fieldType != 'media') ? fieldValue : [{
                id: this.$uid(),
                ...fieldFile,
                filename: field.label,
              }],
              fieldType: fieldType
            })
          })

          this.modal.loading = false
        }).catch(error => {
          this.modal.loading = false
        })
      }
    },
    //Reset Modal
    resetModal() {
      this.modal = {show: false, request: false}
    }
  }
}
</script>
