<template>
  <div>
    <infomation
      ref="modalInfortion"
      @kanbanRefresh="kanbanRefresh"
    />
    <crud
      :crudData="import('modules/qrequestable/_crud/requests.vue')"
      :custom-data="customData"
      :title="$tr($route.meta.title)"
      ref="crudRequests"
    />
  </div>
</template>
<script>
//Components
import fileList from "modules/qsite/_components/master/fileList";
import infomation from 'modules/qrequestable/_components/modals/information/components/index.vue'
export default {
  components: { fileList, infomation },
  data() {
    return {
      crudId: this.$uid(),
      modal: {
        title: null,
        show: false,
        loading: false,
        requestData: [],
        tab: "comments",
      },
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
      saveForm: this.saveForm,
    };
  },
  computed: {
    deletePermissions() {
      return this.$hasAccess('requestable.requestables.destroy');
    },
    customData() {
      return {
        read: {
          actions: [
            {
              name: "viewEntity",
              icon: "fa-light fa-eye",
              label: this.$tr("isite.cms.label.show"),
              format: (field) => {
                return field.requestableUrl ? {} : { vIf: false };
              },
              action: (item) => {
                if (item.requestableUrl)
                  this.$helper.openExternalURL(item.requestableUrl);
              },
            },
            {
              name: "viewLead",
              icon: "fa-light fa-info-circle",
              color: "info",
              tooltip: this.$tr("isite.cms.label.information"),
              action: (item) => {
                this.showModal(item)
              },
            },
            {
              name: "deleteLead",
              label: this.$tr('isite.cms.label.delete'),
              color: 'red',
              icon: 'fa-light fa-trash-alt',
              format: (field) => {
                return { vIf: this.deletePermissions };
              },
              action: (item, automation) => {
                this.delete(item, automation)
              },
            }
          ],
        },
      };
    },
  },
  methods: {
    //update
    async showModal(requestData) {
      await this.$refs.modalInfortion.showRequestData(requestData);
    },
    //delete
    async delete(item, automation = false) {
      if (this.$refs.crudRequests.$refs.crudIndex.$refs.kanban) {
        this.$refs.crudRequests.$refs.crudIndex.$refs.kanban.deleteKanbanCard(item, automation);
      }
    },
    async kanbanRefresh(statusId) {
      if (this.$refs.crudRequests.$refs.crudIndex.$refs.kanban) {
          this.$refs.crudRequests.$refs.crudIndex.$refs.kanban.addCard(statusId);
      }
    },
  },
};
</script>
