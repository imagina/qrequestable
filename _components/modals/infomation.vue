<template>
  <div>
    <master-modal v-model="modal.show" @hide="resetModal()" :loading="modal.loading"
                :title="modal.title" custom-position >
    <div class="">  

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">

          <q-card class="no-shadow tw-rounded-xl tw-border">
            <q-card-section class="">
              <div class="tw-text-sm tw-font-bold">{{$tr(`requestable.cms.titleInformation`)}}</div>
            </q-card-section>
            <q-separator/>
            <q-card-section>
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

            </q-card-section>
          </q-card>

        </div>
        <div class="col-12 col-md-8">
          <q-card class="no-shadow tw-rounded-xl tw-border">
            <!--
            <q-card-section>
              <div class="tw-text-sm tw-font-bold">comentarios</div>
            </q-card-section>
            <q-separator/>-->
            <q-card-section>
              <q-list dense class="list-comments" >
                <q-item class="tw-my-3 " style="padding: 0px !important;">
                    <q-item-section top avatar>
                        <q-avatar size="md" color="grey-4" class="tw-ml-2">
                            <img :src="dataBase.avatar">
                        </q-avatar>
                    </q-item-section>
                    <q-item-section v-if="!dataBase.active" class="tw-mr-4 tw-cursor-pointer">
                      <q-card flat bordered>
                        <q-tooltip>{{$tr(`isite.cms.label.edit`)}}</q-tooltip>
                        <q-card-section class="tw-py-2 tw-cursor-pointer text-grey-6" v-html="textPlaceholder" @click="activeText()" />
                        
                      </q-card>
                    </q-item-section>
                    <q-item-section class="bg-grey-1 shadow-1 tw-p-2" v-else>
                        <!-- <q-editor v-model="dataBase.text" min-height="5rem"  />-->
                        <CKEditor v-model="dataBase.text" :config="editorConfig"></CKEditor>
                        <div class="flex justify-between">
                            <div class="tw-mt-2 tw-space-x-2">
                                <q-btn :loading="loading" :disable="dataBase.text==''" @click="addComment()" rounded size="md" :label="$tr(`isite.cms.label.save`)" color="primary" no-caps  />
                                <q-btn flat size="md" @click="cancelText()"  padding="4px 4px" icon="close" color="primary"  />
                            </div>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-timeline class="grey-4">
                            <q-timeline-entry v-for="(item, index, itemKey) in modal.comments" :key="itemKey" :avatar="item.userProfile.mainImage">
                              <h4>
                                  <strong>{{ item.userProfile.fullName }}</strong> 
                                  <small> 
                                      {{formatDate(item.updatedAt)}} 
                                      <span v-if="item.createdAt !== item.updatedAt"> ({{$tr(`isite.cms.label.edited`)}})</span> 
                                  </small>
                              </h4> 
                              <!-- <q-editor v-model="item.comment" min-height="5rem" v-if="item.active" />-->
                              <CKEditor v-model="item.comment" v-if="item.active"></CKEditor>
                              <div v-else>
                                  <q-card flat bordered>
                                      <q-card-section class="tw-py-2 tw-cursor-pointer" v-html="item.comment" @click="activeEdit(item.id)" />
                                      <q-tooltip>Click aqui</q-tooltip>  
                                  </q-card>
                                  <p class="tw-mt-2 tw-text-xs">
                                      <q-btn flat size="xs" @click="deleteComment(item.id)" padding="4px 4px" icon="fa-solid fa-trash-can" color="primary">
                                        <q-tooltip>{{$tr(`isite.cms.label.delete`)}}</q-tooltip>
                                      </q-btn>
                                  </p>
                              </div>
                              <div class="flex justify-between" v-if="item.active" >
                                  <div class="tw-mt-2 tw-space-x-2">
                                      <q-btn :disable="item.comment=='' || item.comment==item.textEdit" :loading="item.loading" @click="updateComment('edit',item.id)" rounded size="md" :label="$tr(`isite.cms.label.update`)" color="primary" no-caps  />
                                      <q-btn flat size="md" @click="updateComment('cancel',item.id)" padding="4px 4px" icon="close" color="primary">
                                        <q-tooltip>Deshacer {{$tr(`isite.cms.label.delete`)}}</q-tooltip>
                                      </q-btn>
                                  </div>
                              </div>
                            </q-timeline-entry>
                        </q-timeline>
                    </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

        </div>
      </div>
    </div>
    </master-modal>
  </div>
</template>
<script>
//Components
import fileList from '@imagina/qsite/_components/master/fileList';
import CKEditor from '@imagina/qsite/_components/master/ckEditor';

export default {
  components: {fileList, CKEditor},
  data() {
    return {
      loading: false,
      commentableId: null,
      route: 'apiRoutes.qrequestable.comments',
      textPlaceholder: 'Escriba un comentario...',
      editorConfig: {
        height: 100,
      },
      modal: {
        title: null,
        show: false,
        loading: false,
        requestData: [],
      },
      dataBase: {
        text: '',
        textEdit:'',
        active: false,
        user: '',
        avatar: 'https://dev-gestionhc.ozonohosting.com/modules/iprofile/img/default.jpg',
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
    /*routeKanban() {
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
    }*/
  },
  beforeDestroy() {
    console.log('Antes de cerrar.');
  },
  beforeCreate() {
    console.log('Antes de iniciar.')
  },
  methods: {
    formatDate(date) {
      return this.$moment(date).format("MMMM Do YYYY, h:mm:ss a")
    },
    //Fields to show
    async showRequestData(requestData) {
      console.log(requestData);
      this.commentableId = requestData.id;
      this.getCommentsList(requestData.id);
      //Set modal data
      this.modal = {
        title: requestData.category.title,
        show: true,
        loading: true,
        requestData: [],
        comments: []
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
    },
    activeText() {
      this.dataBase.active = true;
      this.dataBase.text = '';
    },
    cancelText() {
      if(this.dataBase.text.length > 0) {
      this.$q.dialog({
          ok: 'Si',
          message: "quiere deshacer el comentario",
          cancel: true,
          persistent: true
        }).onOk(async() => {
          this.dataBase.active = false;
          this.dataBase.text = '';
        }).onCancel(() => {})
      }
      else {
        this.dataBase.active = false;
      }
    },
    updateComment(type, id) {
      try {
        const comment = this.modal.comments.find(item => item.id === id);
        if (comment) {
          if(type=="cancel"){
            this.cancelComment(comment);
          }
          if(type=="edit"){
              if (comment.comment !== comment.textEdit){
                if(comment.comment.length>5) {
                  this.$q.dialog({
                    ok: 'Si',
                    message: "seguro que desea actualizar el comentario",
                    cancel: true,
                    persistent: true
                  }).onOk(async() => {
                    this.editComment(id,comment);
                  }).onCancel(() => {})
                } else {
                  this.$alert.warning({ message: 'El texto deba ser mayor a 5 caracteres' });
                }
              } else {
                this.cancelComment(comment);
              }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    cancelComment(comment) {
      if (comment.comment !== comment.textEdit){
      this.$q.dialog({
          ok: 'Si',
          message: this.$tr(`requestable.cms.message.undoComment`),
          cancel: true,
          persistent: true
        }).onOk(async() => {
          comment.comment = comment.textEdit;
          comment.active = false;
        }).onCancel(() => {})
      } else {
        comment.active = false;
      }
    },
    editComment(id,comment) {
      comment.loading = true;
      this.$crud.put(`${this.route}/${id}`, comment.comment).then(response => {
        console.log(response);
        //comment.updatedAt = this.$moment().format('MMMM Do YYYY, h:mm:ss a'),
        //comment.active = false;
        comment.loading = false;
      }).catch(error => {
        comment.loading = false;
        console.log(error);
        this.$alert.error({ message: 'error no actualizo' });
      })
    },
    activeEdit(id) {
      try {
        const comment = this.modal.comments.find(item => item.id === id);
        if (comment) {
          comment.textEdit = comment.comment;
          comment.active = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    addComment() {
      if(this.dataBase.text.length>5) {
        this.modal.loading = true;
        const params = {  
          commentableType: 'Modules\\Requestable\\Entities\\Requestable',
          commentableId: this.commentableId,
          comment: this.dataBase.text
        };
        this.$crud.create(this.route, params).then(response => {
          console.log(response.data);
          const data = response.data;
         // this.modal.comments.unshift({ ...data, active: false, loading: false });
          this.getCommentsList(this.commentableId);
          this.modal.loading = false;
          this.dataBase.active = false;
          this.dataBase.text = '';
          this.$alert.info({ message: 'Registro exitoso' });
        }).catch(error => {
            console.log(error);
            this.modal.loading = false;
            this.$alert.error({ message: 'No se puedo guardar su comentario' });
        })
      } else {
        this.$alert.warning({ message: 'El texto deba ser mayor a 5 caracteres' });
      }
    },
    async deleteComment(id) {
      this.$q.dialog({
          ok: this.$tr('isite.cms.label.delete'),
          message: this.$tr('isite.cms.message.deleteRecord'),
          cancel: true,
          persistent: true
        }).onOk(async() => {

          this.modal.loading = true;
          this.$crud.delete(this.route,id).then(response => {
              console.log(response.data);
              this.modal.comments = this.modal.comments.filter(item => item.id !== id);
              this.$alert.info({ message: this.$tr('isite.cms.message.recordDeleted') });
              this.modal.loading = false;
          }).catch(error => {
              console.log(error);
              this.modal.loading = false;
              this.$alert.error({ message: 'No se pudo eliminar' });
          })
        }).onCancel(() => {})
    },
    getCommentsList(commentableId) {
      const params = { 
        filter: {  
          commentableType: 'Modules\\Requestable\\Entities\\Requestable',
          commentableId,
        },
        include: 'userProfile',
      };
      this.$crud.get(this.route, params).then(response => {
        console.log(response.data);
        const data = response.data;
        this.modal.comments = data.map(item =>({
          ...item,
          active: false,
          loading: false,
          textEdit: '',
        }))
        console.log(this.modal.comments);
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        this.$alert.error({ message: 'error no actualizo' });
        console.log(error);
      })
    },
  }
}
</script>

<style>
  .list-comments .q-timeline__subtitle, 
  .list-comments .q-timeline__title,
  .list-comments .q-btn-dropdown__arrow {
    @apply tw-hidden;
  }
  .list-comments .q-timeline__dot-img {
    background: #e0e0e0;
  }
</style>