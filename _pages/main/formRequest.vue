<template>
  <div id="formRequestPanelPage">
    <div class="relative-position">
      <!--Page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions @refresh="init" :title="$tr('requestable.cms.newRequest')"/>
      </div>
      <!--Fields-->
      <div class="box box-auto-height q-mb-md">
        <dynamic-field v-for="(field, keyField) in formFields" :key="keyField"
                       v-model="formData[keyField]" :field="field"/>
      </div>
      <!--Dinamic form-->
      <dynamic-form v-if="formCategory.vIf" v-bind="formCategory"
                    @sent="$router.push({name : 'qrequestable.main.requestables'})"/>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
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
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      categories: [],
      formData: {categoryType: null, createdBy: null},
      categoryType: null
    }
  },
  computed: {
    //Return dynamic field config to select a categories
    formFields() {
      var userData = this.$store.state.quserAuth.userData
      return {
        categoryType: {
          value: null,
          type: 'select',
          help: {
            description: this.$tr('requestable.cms.selectRequestCategoryToForm')
          },
          props: {
            label: this.$tr('isite.cms.label.category'),
            options: this.$array.select(this.categories, {label: 'title', id: 'type'})
          }
        },
        requestedBy: {
          value: userData.id,
          type: 'select',
          permission: "requestable.requestables.edit-requested-by",
          props: {
            label: this.$tr('isite.cms.form.createdBy'),
            options: [{label: userData.fullName, value: userData.id}]
          },
          loadOptions: {
            apiRoute: "apiRoutes.quser.users",
            select: {label: 'fullName', id: 'id'},
            //filterByQuery: true
          }
        }
      }
    },
    //Return request selected
    selectedCategory() {
      if (!this.formData.categoryType) return false
      return this.categories.find(item => item.type == this.formData.categoryType)
    },
    //Return category form config
    formCategory() {
      return {
        vIf: (this.selectedCategory && this.selectedCategory.form) ? true : false,
        formId: this.selectedCategory?.form?.id || null,
        sendTo: {
          apiRoute: 'apiRoutes.qrequestable.requestables',
          extraData: {
            type: this.formData.categoryType,
            requestedBy: this.formData.createdBy || this.$store.state.quserAuth.userId
          }
        }
      }
    }
  },
  methods: {
    init() {
      this.formData.categoryType = (this.$route.query.type || null)
      this.getData(true)
    },
    //Get data
    getData(refresh = false) {
      return new Promise((resolve, reject) => {
        this.loading = true
        //Requets params
        let requestParams = {
          refresh: refresh,
          params: {filter: {internal: false}}
        }
        //Request
        this.$crud.index('apiRoutes.qrequestable.categories', requestParams).then(response => {
          this.categories = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
