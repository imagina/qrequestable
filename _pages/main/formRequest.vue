<template>
  <div id="formRequestPanelPage">
    <div class="relative-position">
      <!--Page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions
          @refresh="init"
          :title="$tr('requestable.cms.newRequest')"
        />
      </div>
      <!--Fields-->
      <div class="box box-auto-height q-mb-md">
        <dynamic-field
          v-for="(field, keyField) in formFields"
          :key="keyField"
          v-model="formData[keyField]"
          :field="field"
          @input="setForm(keyField)"
        />
      </div>
      <!--Dinamic form-->
      <dynamic-form
        v-if="dynamicForm.vIf"
        v-bind="dynamicForm"
        @sent="$router.push({ name: 'qrequestable.main.requestables' })"
      />
      <!--Inner loading-->
      <inner-loading :visible="loading" />
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init();
    });
  },
  data() {
    return {
      loading: false,
      categories: [],
      formData: { categoryType: null, requestedBy: null },
      categoryType: null,
      statusList: [],
      dynamicForm: {vIf: false},
    };
  },
  computed: {
    //Return dynamic field config to select a categories
    formFields() {
      var userData = this.$store.state.quserAuth.userData;
      return {
        categoryType: {
          value: null,
          type: "select",
          help: {
            description: this.$tr(
              "requestable.cms.selectRequestCategoryToForm"
            ),
          },
          props: {
            selectByDefault: true,
            label: this.$tr("isite.cms.label.category"),
            options: this.$array.select(this.categories, {
              label: "title",
              id: "type",
            }),
          },
        },
        requestedBy: {
          value: null,
          type: "crud",
          permission: "requestable.requestables.edit-requested-by",
          props: {
            crudType: "select",
            crudData: import("@imagina/quser/_crud/users"),
            crudProps: {
              label: this.$tr("isite.cms.form.requestedBy"),
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: "fullName",
                value: "id",
              },
            },
          },
        },
        statusId: {
          value: null,
          type: "select",
          permission: "requestable.requestables.filter-status",
          props: {
            label: `${this.$tr("isite.cms.form.status")}`,
            clearable: true,
            options: this.statusList
          },
        },
        createdBy: {
          value: this.$store.state.quserAuth.userId,
          type: "crud",
          permission: "requestable.requestables.edit-created-by",
          props: {
            crudType: "select",
            crudData: import("@imagina/quser/_crud/users"),
            crudProps: {
              label: this.$tr("isite.cms.form.createdBy"),
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: "fullName",
                value: "id",
              },
            },
          },
        },
      };
    },
    //Return request selected
    selectedCategory() {
      if (!this.formData.categoryType) return false;
      return this.categories.find(
        (item) => item.type == this.formData.categoryType
      );
    },
  },
  methods: {
    init() {
      this.formData.categoryType = this.$route.query.type || null;
      this.getData(true);
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: { filter: { internal: false } },
        };
        //Request
        this.$crud
          .index("apiRoutes.qrequestable.categories", requestParams)
          .then((response) => {
            this.categories = response.data;
            this.loading = false;
          })
          .catch((error) => {
            this.$apiResponse.handleError(error, () => {
              this.loading = false;
            });
          });
      });
    },
    async getStatus() {
      let requestParams = {
        params: { filter: { categoryId: this.selectedCategory?.id } },
      };
      const response = await this.$crud.index("apiRoutes.qrequestable.statuses", requestParams);
      return response.data.map(item => ({label: item.title, value: item.id,}));
    },
    async setForm(key) {
      if (key === "categoryType") {
        this.formData.statusId = null;
        this.statusList = await this.getStatus();
        if(this.statusList.length > 0) {
          this.formData.statusId = this.statusList[0].value || null;
          this.formCategory();
        }
      }
    },
    formCategory() {
      console.log(this.formData.statusId);
      this.dynamicForm = {
        vIf:
          this.selectedCategory &&
          this.selectedCategory.form &&
          this.formData.statusId
            ? true
            : false,
        formId: this.selectedCategory?.form?.id || null,
        sendTo: {
          apiRoute: "apiRoutes.qrequestable.requestables",
          extraData: {
            type: this.formData.categoryType,
            statusId: this.formData.statusId,
            requestedBy:
              this.formData.requestedBy || this.$store.state.quserAuth.userId,
          },
        },
      };
    }
  },
};
</script>
<style lang="stylus"></style>
