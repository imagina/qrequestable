<template>
  <div>
    <master-modal
      v-model="modal.show"
      @hide="resetModal()"
      :loading="modal.loading"
      :title="modal.title"
      custom-position
      modalWidthSize="98%"
    >
      <div class="">
        <div class="row q-col-gutter-md">
          <div class="col">
            <dynamic-form
                v-model="form"
                :form-id="formId"
                @submit="saveForm"
              />
          </div>
          <div
            class="col-12 col-md-8 col-lg-7"
            v-if="permisionComments.index"
          >
            <q-card class="box tw-rounded-xl tw-h-full">
              <q-card-section>
                <q-list dense class="list-comments">
                  <q-item
                    class="tw-my-3"
                    style="padding: 0px !important"
                    v-if="permisionComments.create"
                  >
                    <q-item-section top avatar>
                      <q-avatar size="md" color="grey-4" class="tw-ml-2">
                        <img :src="dataBase.avatar" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      v-if="!dataBase.active"
                      class="tw-mr-4 tw-cursor-pointer"
                    >
                      <q-card flat bordered>
                        <q-card-section
                          class="tw-py-2 tw-cursor-pointer text-grey-6"
                          v-html="textPlaceholder"
                          @click="activeText()"
                          :title="$tr(`isite.cms.label.edit`)"
                        />
                      </q-card>
                    </q-item-section>
                    <q-item-section class="bg-grey-1 shadow-1 tw-p-2" v-else>
                      <CKEditor
                        v-model="dataBase.text"
                        :config="editorConfig"
                      ></CKEditor>
                      <div class="flex justify-between">
                        <div class="tw-mt-2 tw-space-x-2">
                          <q-btn
                            :loading="loading"
                            :disable="dataBase.text == ''"
                            @click="addComment()"
                            rounded
                            size="md"
                            :label="$tr(`isite.cms.label.save`)"
                            color="primary"
                            no-caps
                          />
                          <q-btn
                            flat
                            size="md"
                            @click="cancelText()"
                            padding="4px 4px"
                            icon="close"
                            color="primary"
                          />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="permisionComments.index">
                    <q-item-section>
                      <q-timeline class="grey-4">
                        <q-timeline-entry
                          v-for="(item, index, itemKey) in modal.comments"
                          :key="itemKey"
                          :avatar="item.userProfile.mainImage"
                        >
                          <h4 class="tw-text-sm">
                            <strong>
                              {{ item.userProfile.fullName }}
                            </strong>
                            <small>
                              {{ formatDate(item.updatedAt) }}
                              <span v-if="item.createdAt !== item.updatedAt">
                                ({{ $tr(`isite.cms.label.edited`) }})</span
                              >
                            </small>
                          </h4>
                          <CKEditor
                            v-model="item.comment"
                            v-if="item.active"
                          ></CKEditor>
                          <div v-else>
                            <q-card flat bordered>
                              <q-card-section
                                class="tw-py-2 tw-cursor-pointer"
                                v-html="item.comment"
                                @click="activeEdit(item.id)"
                                :title="$tr(`isite.cms.label.edit`)"
                                v-if="permisionComments.edit"
                              />
                              <q-card-section
                                class="tw-py-2"
                                v-html="item.comment"
                                v-else
                              />
                            </q-card>
                            <p class="tw-mt-2 tw-text-xs">
                              <a
                                v-if="permisionComments.destroy"
                                class="link-delete tw-cursor-pointer"
                                @click="deleteComment(item.id)"
                                >Eliminar</a
                              >
                            </p>
                          </div>
                          <div class="flex justify-between" v-if="item.active">
                            <div class="tw-mt-2 tw-space-x-2">
                              <q-btn
                                :disable="
                                  item.comment == '' ||
                                  item.comment == item.textEdit
                                "
                                :loading="item.loading"
                                @click="updateComment('edit', item.id)"
                                rounded
                                size="md"
                                :label="$tr(`isite.cms.label.update`)"
                                color="primary"
                                no-caps
                              />
                              <q-btn
                                flat
                                size="md"
                                @click="updateComment('cancel', item.id)"
                                padding="4px 4px"
                                icon="close"
                                color="primary"
                              >
                                <q-tooltip>{{
                                  $tr(`isite.cms.label.cancel`)
                                }}</q-tooltip>
                              </q-btn>
                            </div>
                          </div>
                        </q-timeline-entry>
                      </q-timeline>
                    </q-item-section>
                  </q-item>
                  <q-item v-else>
                    <q-item-section class="tw-mt-5">
                      No tiene permisos para visualizar los comentarios
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
import fileList from "@imagina/qsite/_components/master/fileList";
import CKEditor from "@imagina/qsite/_components/master/ckEditor";
const commentModel = {
  text: "",
  textEdit: "",
  active: false,
  user: "",
  avatar:
    "https://dev-gestionhc.ozonohosting.com/modules/iprofile/img/default.jpg",
};
export default {
  components: { fileList, CKEditor },
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
      formId: null,
      requestedBy: null,
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
    permisionComments() {
      return {
        create: this.$auth.hasAccess("icomments.comments.create"),
        edit: this.$auth.hasAccess("icomments.comments.edit"),
        index: this.$auth.hasAccess("icomments.comments.index"),
        destroy: this.$auth.hasAccess("icomments.comments.destroy"),
      };
    },
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
      this.requestedBy = requestData.requestedBy?.id || null;

      //Set modal data
      this.modal = {
        title: `ID:${this.requestableId} - Estado: ${requestData.status.title}`,
        show: true,
        loading: true,
        requestData: [],
        comments: [],
      };

      this.getCommentsList(this.requestableId);

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
      this.modal = { show: false, request: false, comments: [] };
      this.dataBase = { ...commentModel };
    },
    updateRequest(itemId) {
      this.$refs.crudRequests.update({ id: itemId });
    },
    activeText() {
      this.dataBase.active = true;
      this.dataBase.text = "";
    },
    cancelText() {
      if (this.dataBase.text.length > 0) {
        this.$q
          .dialog({
            ok: "Si",
            message: "quiere deshacer el comentario",
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            this.dataBase.active = false;
            this.dataBase.text = "";
          })
          .onCancel(() => {});
      } else {
        this.dataBase.active = false;
      }
    },
    updateComment(type, id) {
      try {
        const comment = this.modal.comments.find((item) => item.id === id);
        if (comment) {
          if (type == "cancel") {
            this.cancelComment(comment);
          }
          if (type == "edit") {
            if (comment.comment !== comment.textEdit) {
              this.editComment(id, comment);
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
      if (comment.comment !== comment.textEdit) {
        this.$q
          .dialog({
            ok: "Si",
            message: this.$tr(`requestable.cms.message.undoComment`),
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            comment.comment = comment.textEdit;
            comment.active = false;
          })
          .onCancel(() => {});
      } else {
        comment.active = false;
      }
    },
    editComment(id, comment) {
      try {
        comment.loading = true;
        this.$crud
          .update(this.route, id, { comment: comment.comment })
          .then((response) => {
            const commentUpdate = response.data;
            comment.updatedAt = commentUpdate.updatedAt;
            comment.loading = false;
            comment.active = false;
            comment.edit = false;
            this.$alert.info({ message: "Comentario actualizado" });
          })
          .catch((error) => {
            comment.loading = false;
            console.log(error);
            this.$alert.error({
              message: "No se puedo actualizar el commentario",
            });
          });
      } catch (error) {
        console.log(error);
      }
    },
    activeEdit(id) {
      try {
        const comment = this.modal.comments.find((item) => item.id === id);
        if (comment) {
          comment.textEdit = comment.comment;
          comment.active = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async addComment() {
      try {
        this.modal.loading = true;
        const params = {
          commentableType: "Modules\\Requestable\\Entities\\Requestable",
          commentableId: this.requestableId,
          comment: this.dataBase.text,
        };
        await this.$crud
          .create(this.route, params)
          .then((response) => {
            const data = response.data;
            this.getCommentsList(this.requestableId);
            this.modal.loading = false;
            this.dataBase.active = false;
            this.dataBase.text = "";
            this.$alert.info({ message: "Registro exitoso" });
          })
          .catch((error) => {
            console.log(error);
            this.modal.loading = false;
            this.$alert.error({ message: "No se puedo guardar su comentario" });
          });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteComment(id) {
      this.$q
        .dialog({
          ok: this.$tr("isite.cms.label.delete"),
          message: this.$tr("isite.cms.message.deleteRecord"),
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          this.modal.loading = true;
          this.$crud
            .delete(this.route, id)
            .then((response) => {
              console.log(response.data);
              this.modal.comments = this.modal.comments.filter(
                (item) => item.id !== id
              );
              this.$alert.info({
                message: this.$tr("isite.cms.message.recordDeleted"),
              });
              this.modal.loading = false;
            })
            .catch((error) => {
              console.log(error);
              this.modal.loading = false;
              this.$alert.error({ message: "No se pudo eliminar" });
            });
        })
        .onCancel(() => {});
    },
    getCommentsList(commentableId) {
      try {
        const params = {
          filter: {
            commentableType: "Modules\\Requestable\\Entities\\Requestable",
            commentableId,
          },
          include: "userProfile",
        };
        this.$crud
          .get(this.route, params)
          .then((response) => {
            const data = response.data;
            this.modal.comments = data.map((item) => ({
              ...item,
              active: false,
              loading: false,
              textEdit: "",
            }));
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            this.$alert.error({ message: "error no actualizo" });
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
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