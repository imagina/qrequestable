<template>
  <div>
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
                <q-item-label v-else caption>
                  {{ Array.isArray(item.value) ? item.value.join(",") : item.value }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </master-modal>
  <kanban :routes="routeKanban" />
  <crud :crudData="import('@imagina/qrequestable/_crud/requests.vue')" type="onlyForm" ref="crudRequests"/>
  </div>
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
  provide() {
    return {
      showRequestData: this.showRequestData,
      updateRequest: this.updateRequest
    }
  },
  computed: {
    routeKanban() {
      return {
          funnel: {
            apiRoute: 'apiRoutes.qrequestable.categories',
          },
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
      }
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
    },
    updateRequest(itemId) {
        this.$refs.crudRequests.update({id: itemId})
    }
  }
}
</script>