<template>
  <div>
  <master-modal v-model="modal.show" @hide="resetModal()" :loading="modal.loading"
                :title="modal.title" custom-position>
    <div class="box tw-h-full">
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
          <!-- Model test -->
          <q-list dense class="list-comments">
            <q-item class="tw-my-3 " style="padding: 0px !important;">
                <q-item-section top avatar>
                    <q-avatar size="md" class="tw-ml-2">
                        <img :src="dataBase.avatar">
                    </q-avatar>
                </q-item-section>
                <q-item-section v-if="!dataBase.active" class="tw-mr-4">
                    <q-input outlined dense placeholder="Escriba un comentario" @click="dataBase.active = !dataBase.active;dataBase.text=''"/>
                </q-item-section>
                <q-item-section class="bg-grey-1 shadow-1 tw-p-2" v-else>
                    <q-editor v-model="dataBase.text" min-height="5rem"  />
                    <div class="flex justify-between">
                        <div class="tw-mt-2 tw-space-x-2">
                            <q-btn :disable="dataBase.text==''" @click="addComment()" rounded size="md" label="Guardar" color="primary" no-caps  />
                            <q-btn flat size="md" @click="cancelText()"  padding="4px 4px" icon="close" color="primary"  />
                        </div>
                        <div class="tw-mt-2 tw-space-x-1">
                            <q-btn flat size="md" padding="4px 4px" icon="attach_file" color="primary"  />
                            <q-btn-dropdown flat size="md" padding="4px 4px" icon="alternate_email" color="primary">
                                <div class="q-pa-md">
                                    <q-input outlined dense v-model="dataBase.search" placeholder="Buscar usuarios"/>
                                    <q-list class="tw-mt-2">
                                        <q-item clickable  @click="addUser(user.name,1)" v-for="user in filteredUser()">
                                            <q-item-section avatar>
                                                <q-avatar size="md" round>
                                                    <img :src="user.avatar">
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>{{user.fullName}}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </q-btn-dropdown>
                        </div>
                    </div>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section>
                    <q-timeline color="primary">
                        <q-timeline-entry v-for="(comment, index) in commentsExample" :avatar="comment.avatar">
                            <h4>
                                <strong>{{comment.fullName}}</strong> 
                                <small> 
                                    {{comment.dateStart}}
                                    <span v-if="comment.dateUpdate"> (editado)</span>    
                                </small>
                            </h4> 
                            <q-editor v-model="comment.content" min-height="5rem" v-if="comment.active" />
                            <div v-else>
                                <q-card flat bordered @click="comment.active = !comment.active" >
                                    <q-card-section class="tw-py-2" v-html="comment.content" />
                                </q-card>
                                <p class="tw-mt-2 tw-text-xs">
                                    <a class="link-edit tw-cursor-pointer" @click="activeEdit(comment.content,index)">Editar</a> - 
                                    <a class="link-delete tw-cursor-pointer" @click="deleteComment(index)">Eliminar</a>
                                </p>
                            </div>
                            <div class="flex justify-between" v-if="comment.active" >
                                <div class="tw-mt-2 tw-space-x-2">
                                    <q-btn @click="editComment(index)" rounded size="md" label="Guardar" color="primary" no-caps  />
                                    <q-btn flat size="md" @click="cancelComment(index)" padding="4px 4px" icon="close" color="primary"  />
                                </div>
                                <div class="tw-mt-2 tw-space-x-1">
                                    <q-btn flat size="md" padding="4px 4px" icon="attach_file" color="primary"  />
                                    <q-btn-dropdown flat size="md" padding="4px 4px" icon="alternate_email" color="primary">
                                <div class="q-pa-md">
                                    <q-input outlined dense v-model="dataBase.search" placeholder="Buscar usuarios"/>
                                    <q-list class="tw-mt-2">
                                        <q-item clickable  @click="addUser(user.name,2,index)" v-for="user in filteredUser()">
                                            <q-item-section avatar>
                                                <q-avatar size="md" round>
                                                    <img :src="user.avatar">
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>{{user.fullName}}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </q-btn-dropdown>
                                </div>
                            </div>
                        </q-timeline-entry>
                    </q-timeline>
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
      dataBase: {
        text: '',
        textEdit:'',
        search:'',
        active: false,
        user: 'Maria Lopez',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      },
      commentsExample: [
        {
            fullName: 'Juan Perez',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
            dateStart: '21 de mar. a las 21:17',
            dateUpdate: '',
            content: 'Lorem',
            active: false,
        },
        {
            fullName: 'Pedro Torres',
            avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
            dateStart: '21 de mar. a las 21:17',
            dateUpdate: '21 de mar. a las 21:17',
            content: 'lorem',
            active: false,
        }
      ],
      usersExample: [
        {
          fullName: 'Juan Perez',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
          name: '@juanperez'
        },
        {
            fullName: 'Pedro Torres',
            avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
            name: '@pedrotorres'
        }
      ]
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
    },
    deleteComment(index) {
        this.commentsExample.splice(index,1);
    },
    cancelText() {
        this.dataBase.active = !this.dataBase.active;
        this.dataBase.text = '';
    },
    activeEdit(content,index) {
        this.dataBase.textEdit = content;
        this.commentsExample[index].active = true;
    },
    addComment() {
      this.commentsExample.unshift({
          fullName: this.dataBase.user,
          avatar: this.dataBase.avatar,
          dateStart: new Date().toGMTString(),
          dateUpdate: '',
          content: this.dataBase.text,
          active: false,
      });
      this.cancelText();
    },
    editComment(index) {
        this.commentsExample[index].dateUpdate = new Date();
        this.commentsExample[index].active = false;
    },
    cancelComment(index) {
        this.commentsExample[index].content = this.dataBase.textEdit;
        this.commentsExample[index].active = false;
    },
    addUser(name,type,index) {
        if(type==1) { this.dataBase.text = this.dataBase.text + ' ' + name; }
        else {
            this.commentsExample[index].content = this.commentsExample[index].content + ' ' + name;
        }
    },
    filteredUser() {
        return this.usersExample.filter(user => {
            return user.fullName.toLowerCase().includes(this.dataBase.search.toLowerCase())
        })
    }
  }
}
</script>

<style>
  .list-comments .q-timeline__subtitle, 
  .list-comments .q-timeline__title,
  .list-comments .q-btn-dropdown__arrow {
     display: none;
  }
  .list-comments .link-edit:hover {
      color: var(--q-color-primary);
  }
  .list-comments .link-delete:hover {
      color: var(--q-color-negative);
  }
</style>