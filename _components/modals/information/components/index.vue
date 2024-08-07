<template>
  <div>
    <superModal
      v-model="modal.show"
      @hide="resetModal()"
      :loading="modal.loading"
      :title="modal.title"
      custom-position
      modalWidthSize="98%"
      :multiActions="multiActions"
      :actions="actions"
    >
      <div class="">
        <div class="row q-col-gutter-md">
          <div class="col">
            <dynamic-field
              v-for="(field, keyField) in field.main"
              :key="keyField"
              v-model="dynamicFieldForm[keyField]"
              :field="field"
              class="tw-py-2"
            />
            <div v-if="this.modal.requestData.length > 0" >
              <dynamic-form
                v-model="form"
                :form-id="formId"
                @submit="saveForm"
                class="tw-my-2"
                noSave
                :requestParams="requestParams"
              />
            </div>
            <dynamic-field
              v-for="(field, keyField) in field.bottom"
              :key="keyField"
              v-model="dynamicFieldForm[keyField]"
              :field="field"
              :itemId="requestableId"
              class="tw-py-2"
            />
          </div>
          <div class="col-12 col-md-8 col-lg-7">
            <comments
            :commentableId="Number(requestableId)"
            />
          </div>

        </div>
      </div>
    </superModal>
    <modalCrud />
    <whatappsModal />
  </div>
</template>
<script>
//Components
import fileList from "modules/qsite/_components/master/fileList";
import CKEditor from "modules/qsite/_components/master/ckEditor";
const commentModel = {
  text: "",
  textEdit: "",
  active: false,
  user: "",
  loading: false,
  avatar:
    "https://dev-gestionhc.ozonohosting.com/modules/iprofile/img/default.jpg",
};
import superModal from './superModal.vue'
import modalCrudStore from '../stores/modalCrud.store.ts'
import modalCrud from './modalCrud.vue'
import fileListComponent from 'modules/qsite/_components/master/fileList'
import modelFiles from '../models/modelFiles.ts'
import comments from 'modules/qsite/_components/master/comments/index.vue'
import whatappsModalStore from '../stores/whatappsModal.ts'
import whatappsModal from './whatappsModal.vue'

export default {
  components: {
    fileList,
    CKEditor,
    superModal,
    modalCrud,
    fileListComponent,
    comments,
    whatappsModal,
  },
  props: {},
  emits: ['kanbanRefresh'],
  data() {
    return {
      loading: false,
      route: "apiRoutes.qrequestable.comments",
      textPlaceholder: "Escriba un comentario...",
      editorConfig: {
        height: 100,
      },
      modal: {
        title: null,
        show: false,
        loading: false,
        requestData: [],
      },
      dataBase: { ...commentModel },
      form: {},
      dynamicFieldForm: {},
      formId: null,
      statusId: null,
      categoryType: null,
      requestableId: null,
      conversations: null,
      requestParams: {
        filter: {
          renderLocation: "requestable",
        },
      },
    };
  },
  provide() {
    return {
      showRequestData: this.showRequestData,
      updateRequest: this.updateRequest,
    };
  },
  inject:{
    addCard: {
      type: Function,
      default: () => false,
    },
  },
  computed: {
    files() {
      return modelFiles;
    },
    permisionComments() {
      return {
        create: this.$hasAccess("icomments.comments.create"),
        edit: this.$hasAccess("icomments.comments.edit"),
        index: this.$hasAccess("icomments.comments.index"),
        destroy: this.$hasAccess("icomments.comments.destroy"),
      };
    },
    field() {
      return {
        main: {
          date: {
          value: null,
          props: {
            label: "Block-in/out Date"
          },
          name: "blockInBlockOut",
          field: { value: 'blockInBlockOut' },
          quickFilter: true
          },
          sourceId: {
            value: null,
            type: 'crud',
            permission: 'requestable.requestables.see-source',
            props: {
              crudType: 'select',
              crudData: import('modules/qrequestable/_crud/sources'),
              crudProps: {
                label: this.$tr('isite.cms.label.source'),
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                readonly: !this.$hasAccess(`requestable.requestables.edit-source`)
              },
              config: {
                filterByQuery: true,
                options: {
                  label: 'title', value: 'id',
                }
              }
          },
        },
        requestedById: {
            value: null,
            type: 'crud',
            permission: 'requestable.requestables.see-requested-by',
            props: {
              crudType: 'select',
              crudData: import('modules/quser/_crud/users'),
              crudProps: {
                label: this.$tr('isite.cms.form.requestedBy'),
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
                readonly: !this.$hasAccess(`requestable.requestables.edit-requested-by`)
              },
              config: {
                filterByQuery: true,
                options: {
                  label: 'fullName', value: 'id', img: 'mainImage'
                }
              },
            },
        },
        responsibleId: {
          value: null,
          type: 'crud',
          permission: 'requestable.requestables.see-responsible',
          props: {
            crudType: 'select',
            crudData: import('modules/quser/_crud/users'),
            crudProps: {
              label: this.$tr('requestable.cms.label.responsible'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
              readonly: !this.$hasAccess(`requestable.requestables.edit-responsible`)
            },
            config: {
              filterByQuery: true,
              options: {
                label: 'fullName', value: 'id', img: 'mainImage'
              }
            }
          },
        }
        },
        bottom: {
          mediasMulti: {
            value: {},
            type: 'media',
            vIf: !this.$hasAccess(`requestable.requestables.see-files`),
            props: {
              label: this.$tr('idocs.cms.sidebar.adminGroup'),
              zone: 'documents',
              entity: "Modules\\Requestable\\Entities\\Requestable",
              entityId: null,
              multiple: true,
              disk: 'privatemedia',
              readonly: !this.$hasAccess(`requestable.requestables.edit-files`),
            }
          },
        }
      }
    },
    multiActions() {
      return [
        {
          props: {
            color: 'green',
            icon: 'fa-brands fa-whatsapp',
            round: true,
          },
          action: async() => {
            try {
              whatappsModalStore.loading = true;
              whatappsModalStore.showModal = true;
                if(!this.conversations) {
                  await this.$crud.post('apiRoutes.qrequestable.chat',{criteria: this.requestableId},{} );
                  whatappsModalStore.roomId = response.data.id;
                } else {

                  whatappsModalStore.roomId = this.conversations.id
                }

                setTimeout(() => {
                  whatappsModalStore.loading = false;
                }, 3000);
            } catch (error) {
              whatappsModalStore.showModal = false;

              whatappsModalStore.loading = false;
            }
          }
        },
      ]
    },
    actions() {
      return [
        {
          props: {
            label: this.$tr('isite.cms.label.save'),
            color: 'primary',
            icon: 'fa-light fa-save',
          },
          action: async () => {
            await this.saveForm();
          }
        },
      ]
    },
  },
  methods: {
    // formatDate(date) {
    //   return date ? this.$moment(date).format("DD MMM YYYY, h:mm a") : null;
    // },
    //Fields to show
    async showRequestData(requestData) {
      this.requestableId = requestData.id;
      this.statusId = requestData.statusId || null;
      this.categoryType = requestData.type || null;
      this.dynamicFieldForm.requestedById = requestData.requestedById || null;
      this.dynamicFieldForm.sourceId = requestData.sourceId || null;
      this.dynamicFieldForm.responsibleId = requestData.responsibleId || null
      this.conversations = requestData.conversation || null;
      const statusTitle = requestData.status
        ? `- Estado: ${requestData?.status?.title}`
        : '';
      //Set modal data
      this.modal = {
        title: `ID:${this.requestableId} ${statusTitle}`,
        show: true,
        loading: true,
        requestData: [],
        comments: [],
      };
      //Get form data
      let form = requestData.category?.form || false;
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
        await this.$crud.show('apiRoutes.qform.forms', form.id, requestFormParams).then(async response => {
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
          this.$apiResponse.handleError(error, () => {
            this.modal.loading = false
          })
        })
      }
      this.modal.loading = false
    },
    //Reset Modal
    resetModal() {
      this.modal = { show: false, loading: false, requestData: [], comments: [] };
      this.dataBase = { ...commentModel };
    },
    updateRequest(itemId) {
      this.$refs.crudRequests.update({ id: itemId });
    },
    async saveForm() {
      try {
        this.modal.loading = true;
        const form = {
          ...this.form,
          ...this.dynamicFieldForm,
          type: this.categoryType,
          statusId: this.statusId,
        };
        await this.$crud.update('apiRoutes.qrequestable.requestables', this.requestableId, form);
        await this.$emit('kanbanRefresh', this.statusId);
        this.modal.show = false;
        this.form = {};
        this.modal.loading = false;
      } catch (error) {
        this.modal.loading = false;
        console.log(error);
      }
    },
  },
};
</script>

<style>
.list-comments .q-timeline__subtitle,
.list-comments .q-timeline__title,
.list-comments .q-btn-dropdown__arrow {
  @apply tw-hidden;
}
.list-comments .link-edit:hover {
  color: var(--q-primary);
}
.list-comments .link-delete:hover {
  color: var(--q-negative);
}
.list-comments .q-timeline__dot-img {
  background: #e0e0e0;
}
</style>
