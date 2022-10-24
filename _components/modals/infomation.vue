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
                    <q-item-section v-if="!dataBase.active" class="tw-mr-4">
                        <q-input outlined dense placeholder="Escriba un comentario" @click="activeText()"/>
                    </q-item-section>
                    <q-item-section class="bg-grey-1 shadow-1 tw-p-2" v-else>
                        <q-editor v-model="dataBase.text" min-height="5rem"  />
                        <div class="flex justify-between">
                            <div class="tw-mt-2 tw-space-x-2">
                                <q-btn :loading="loading" :disable="dataBase.text==''" @click="addComment()" rounded size="md" label="Guardar" color="primary" no-caps  />
                                <q-btn flat size="md" @click="cancelText()"  padding="4px 4px" icon="close" color="primary"  />
                            </div>
                            <div class="tw-mt-2 tw-space-x-1">
                                <q-btn flat size="md" padding="4px 4px" icon="attach_file" color="primary"  />
                            </div>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-timeline class="grey-4">
                            <q-timeline-entry v-for="(item, index, itemKey) in modal.comments" :key="itemKey" :avatar="dataBase.avatar">
                              <h4>
                                  <strong>{{ item.fullName }}</strong> 
                                  <small> 
                                      {{item.createdAt}} 
                                      <span v-if="item.createdAt !== item.updatedAt"> (editado)</span> 
                                  </small>
                              </h4> 
                              <q-editor v-model="item.comment" min-height="5rem" v-if="item.active" />
                              <div v-else>
                                  <q-card flat bordered>
                                      <q-card-section class="tw-py-2" v-html="item.comment" />
                                  </q-card>
                                  <p class="tw-mt-2 tw-text-xs">
                                      <a class="link-edit tw-cursor-pointer" @click="activeEdit(item.id)">Editar</a> - 
                                      <a class="link-delete tw-cursor-pointer" @click="deleteComment(item.id)">Eliminar</a>
                                  </p>
                              </div>
                              <div class="flex justify-between" v-if="item.active" >
                                  <div class="tw-mt-2 tw-space-x-2">
                                      <q-btn :loading="loading" @click="updateComment('edit',item.id)" rounded size="md" label="Editar" color="primary" no-caps  />
                                      <q-btn flat size="md" @click="updateComment('cancel',item.id)" padding="4px 4px" icon="fa-solid fa-rotate-left" color="primary">
                                        <q-tooltip>Deshacer</q-tooltip>
                                      </q-btn>
                                  </div>
                                  <div class="tw-mt-2 tw-space-x-1">
                                    <q-btn flat size="md" padding="4px 4px" icon="attach_file" color="primary"  />
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
    <crud :crudData="import('@imagina/qrequestable/_crud/requests.vue')"  ref="crudRequests"/>
  </div>
</template>
<script>
//Components
import fileList from '@imagina/qsite/_components/master/fileList';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default {
  components: {fileList},
  data() {
    return {
      crudId: this.$uid(),
      loading: false,
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
        avatar: 'http://imgfz.com/i/4DZUkNA.png',
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
    getData() {
      const params = { 
          commentableType: 'Modules\\Requestable\\Entities\\Requestable',
          commentableId: 597, // id ?
        };
      this.$crud.get(`apiRoutes.comments`, params).then(response => {
        console.log(response);
        //this.modal.comments = response;
      
  
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        this.$alert.danger({ message: 'error no actualizo' });
        console.log(error);
      })
    },
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
      console.log(requestData),
      //Set modal data
      this.modal = {
        title: requestData.category.title,
        show: true,
        loading: true,
        requestData: [],
        comments: []
      }

      // user session falta el avatar
      this.dataBase.user = requestData?.title || 'Nameless'
      
      this.addActiveComments(requestData);

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
    // add the active variable
    addActiveComments(requestData){
      this.modal.comments = requestData.comments.map(item =>({
        ...item,
        active: false,
      }))
      
      console.log(this.modal.comments);
    },
    activeText() {
      this.dataBase.active = true;
      this.dataBase.text = '';
    },
    cancelText() {
      this.dataBase.active = false;
      this.dataBase.text = '';
    },
    updateComment(type, id) {
      try {
        const comment = this.modal.comments.find(item => item.id === id);
        if (comment) {

          if(type=="cancel"){
            this.cancelComment(comment);
          }

          if(type=="edit"){
            if (comment.comment !== this.dataBase.textEdit){
              this.editComment(id,comment);
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
      comment.comment = this.dataBase.textEdit;
      comment.active = false;
    },
    editComment(id,comment) {
      this.loading = true;

      /*try {
          const data = { 
            comment: comment.comment 
          };
          baseService.put(`apiRoutes.comments/${id}`, data);
          this.loading = false;
      } catch (error) {
        this.$alert.error({ message: 'No se pudo realizar la actualizacion' });
        console.log(error);
        this.loading = false;
      }*/
   
      this.$crud.put(`apiRoutes.comments/${id}`, comment.comment).then(response => {
        console.log(response);
        //comment.updatedAt = this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        //comment.active = false;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        this.$alert.danger({ message: 'error no actualizo' });
        console.log(error);
      })


    },
    activeEdit(id) {
      try {
        const comment = this.modal.comments.find(item => item.id === id);
        if (comment) {
          this.dataBase.textEdit = comment.comment;
          comment.active = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    addComment() {

      /*let requestParams = this.dataBase.text;
      this.$crud.post('apiRoutes.comments', requestParams).then(response => {
        let comment = { response.data, active: false };
        this.modal.comments.unshift(comment);
        //this.loading = false
      }).catch(error => {
          console.log(error);
        //this.loading = false
      })
      
       try {
        const params = { 
          commentableType: 'Modules\\Requestable\\Entities\\Requestable',
          commentableId: 597,
          comment: comment.comment 
        };
        baseService.create(`apiRoutes.comments`, params);
    } catch (error) {
        console.log(error);
    }
      
      
      */
      this.loading = true;
      try {
        this.modal.comments.unshift({
          id: 345345,
          fullName: this.dataBase.user, 
          avatar: this.dataBase.avatar, 
          createdAt: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
          comment: this.dataBase.text,
          active: false,
        });
        this.loading = false;
        this.$alert.info({ message: 'Registro exitoso' });

      } catch (error) {
        this.loading = false;
        console.log(error);
        this.$alert.error({ message: 'No se puedo guardar su comentario' });
      }

      
      
      this.cancelText();
    },
    async deleteComment(id) {
      this.$q.dialog({
          ok: this.$tr('isite.cms.label.delete'),
          message: this.$tr('isite.cms.message.deleteRecord'),
          cancel: true,
          persistent: true
        }).onOk(async() => {
          this.loading = true;
          try {
            this.modal.comments = this.modal.comments.filter(item => item.id !== id);
            this.$alert.info({ message: this.$tr('isite.cms.message.recordDeleted') });
            this.loading = false;
          } catch (error) {
            this.$alert.error({ message: 'No se pudo eliminar' });
            console.log(error);
            this.loading = false;
          }
       
          
      
        }).onCancel(() => {})
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
  .list-comments .link-edit:hover {
      color: var(--q-color-primary);
  }
  .list-comments .link-delete:hover {
      color: var(--q-color-negative);
  }
  .list-comments .q-timeline__dot-img {
    background: #e0e0e0;
  }
</style>