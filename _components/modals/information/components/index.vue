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
    >
      <div class="">
        <div class="row q-col-gutter-md">
          <div class="col">
            <dynamic-field 
              v-for="(field, keyField) in field" 
              :key="keyField"
              v-model="dynamicFieldForm[keyField]" 
              :field="field" 
              class="tw-py-2"
            />
            <dynamic-form
                v-if="this.modal.requestData.length > 0"
                v-model="form"
                :form-id="formId"
                @submit="saveForm"
              />
              <div>
                <file-list-component 
                  v-bind="files" 
                  @selected="files => $emit('selected', files)"
                />
              </div>
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
  </div>
</template>
<script>
//Components
import fileList from "@imagina/qsite/_components/master/fileList";
import CKEditor from "@imagina/qsite/_components/master/ckEditor";
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
import fileListComponent from '@imagina/qsite/_components/master/fileList'
import modelFiles from '../models/modelFiles.ts'
import comments from '@imagina/qsite/_components/master/comments/index.vue'

export default {
  components: { 
    fileList, 
    CKEditor, 
    superModal, 
    modalCrud,
    fileListComponent,
    comments 
  },
  props: {},
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
        create: this.$auth.hasAccess("icomments.comments.create"),
        edit: this.$auth.hasAccess("icomments.comments.edit"),
        index: this.$auth.hasAccess("icomments.comments.index"),
        destroy: this.$auth.hasAccess("icomments.comments.destroy"),
      };
    },
    field() {
      return {
        createdBy: {
          value: null,
          type: 'crud',
          permission: 'requestable.requestables.edit-created-by',
          props: {
            crudType: 'select',
            crudData: import('@imagina/quser/_crud/users'),
            crudProps: {
              label: this.$tr('isite.cms.form.createdBy'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: 'fullName', value: 'id'
              }
            }
          },
        },
        requestedBy: {
            value: null,
            type: 'crud',
            permission: 'requestable.requestables.edit-created-by',
            props: {
              crudType: 'select',
              crudData: import('@imagina/quser/_crud/users'),
              crudProps: {
                label: this.$tr('isite.cms.form.requestedBy'),
                rules: [
                  val => !!val || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              config: {
                filterByQuery: true,
                options: {
                  label: 'fullName', value: 'id'
                }
              }
            },
        },
      }
    },
    multiActions() {
      return [
        {
          type: 'crud',
          props: {
            color: 'primary',
            icon: 'fa-light fa-folder-open',
            label: this.$tr('idocs.cms.sidebar.adminGroup'),
          },
          action: () => {
            modalCrudStore.showModal = true;
            modalCrudStore.dataCrud = {
              path: import('@imagina/qdocument/_crud/documents.vue'),
              customData: {
                read: {
                  noFilter: true,
                },
              },
              title: this.$tr('idocs.cms.sidebar.adminGroup')
            }
          }
        },
      ]
    }
  },
  methods: {
    formatDate(date) {
      return date ? this.$moment(date).format("DD MMM YYYY, h:mm a") : null;
    },
    //Fields to show
    async showRequestData(requestData) {
      this.requestableId = requestData.id;
      this.statusId = requestData.statusId || null;
      this.categoryType = requestData.type || null;
      this.dynamicFieldForm.requestedBy = requestData.requestedBy?.id || null;
      this.dynamicFieldForm.createdBy = requestData.createdBy || null;

      //Set modal data
      this.modal = {
        title: `ID:${this.requestableId} - Estado: ${requestData.status.title}`,
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
  color: var(--q-color-primary);
}
.list-comments .link-delete:hover {
  color: var(--q-color-negative);
}
.list-comments .q-timeline__dot-img {
  background: #e0e0e0;
}
</style>
