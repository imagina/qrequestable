<template>
  <div id="formRequestPanelPage">
    <div class="relative-position">
      <!--Page actions-->
      <div class="box box-auto-height q-mb-md">
        <page-actions @refresh="init" :title="$tr('qrequestable.layout.newRequest')"/>
      </div>
      <!--Select Category-->
      <div class="box box-auto-height q-mb-md">
        <!--Help text-->
        <div class="q-mb-md">{{ $tr('qrequestable.layout.selectRequestCategoryToForm') }}</div>
        <!--Select field-->
        <dynamic-field v-model="categoryType" :field="fieldCategories"/>
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
      categoryType: null
    }
  },
  computed: {
    //Return dynamic field config to select a categories
    fieldCategories() {
      return {
        value: null,
        type: 'select',
        props: {
          label: this.$tr('ui.label.category'),
          options: this.$array.select(this.categories, {label: 'title', id: 'type'})
        }
      }
    },
    //Return request selected
    selectedCategory() {
      if (!this.categoryType) return false
      return this.categories.find(item => item.type == this.categoryType)
    },
    //Return category form config
    formCategory() {
      return {
        vIf: (this.selectedCategory && this.selectedCategory.form) ? true : false,
        formId: this.selectedCategory?.form?.id || null,
        sendTo: {
          apiRoute: 'apiRoutes.qrequestable.requestables',
          extraData: {
            type: this.categoryType
          }
        }
      }
    }
  },
  methods: {
    init() {
      this.categoryType = this.$route.query.type
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
