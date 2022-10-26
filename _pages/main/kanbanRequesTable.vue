<template>
  <div>
  <master-modal 
    v-model="modal.show" 
    @hide="resetModal()" 
    :loading="modal.loading"
    :title="modal.title" 
    custom-position
  >
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
          <div class="tw-space-y-4">
            <dynamic-form
                v-model="form"
                :form-id="formId"
                @submit="saveForm"
              />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </master-modal>
  
  <crud :crudData="import('@imagina/qrequestable/_crud/requests.vue')"  ref="crudRequests"/>
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
      },
      form: {},
      formId: null,
      requestedBy: null,
      statusId: null,
      categoryType: null,
      requestableId: null,
    }
  },
  provide() {
    return {
      showRequestData: this.showRequestData,
    }
  },
  inject:{
    addCard: {
      type: Function,
      default: () => false,
    },
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
    },
  },
  methods: {
    //Fields to show
    async showRequestData(requestData) {
      //Set modal data
      this.requestableId = requestData.id;
      this.statusId = requestData.statusId || null;
      this.categoryType = requestData.type || null;
      this.requestedBy = requestData.requestedBy?.id || null;
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
        this.formId = form.id;
        //Get field values
        let requestValues = {}
        requestData.fields.forEach(item => requestValues[item.name] = item.value)
        //get files
        let files = this.$clone(requestData.files || [])
        //Request data
        let requestFormParams = {refresh: true, params: {include: 'fields'}}
        //Get form
        this.$crud.show('apiRoutes.qform.forms', form.id, requestFormParams).then(async response => {
          await this.$clone(response.data.fields).forEach(field => {
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
          await this.modal.requestData.forEach(item => {
            //item.dynamicField.value = item.value;
            this.form[item.dynamicField.name] = item.value;
          });

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
    //update
    async saveForm() {
      try {
        this.modal.loading = true;
        const form = {
          ...this.form,
          type: this.categoryType,
          statusId: this.statusId,
          requestedBy: this.requestedBy || this.$store.state.quserAuth.userId
        };
        await this.$crud.update('apiRoutes.qrequestable.requestables', this.requestableId, form);
        if(this.$refs.crudRequests.$refs.crudIndex.$refs.kanban) {
          this.$refs.crudRequests.$refs.crudIndex.$refs.kanban.addCard(this.statusId);
        }
        this.modal.show = false;
        this.form = {};
        this.modal.loading = false;
      } catch (error) {
        this.modal.loading = false;
        console.log(error);
      }
    },
  }
}
</script>