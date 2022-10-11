<template>
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
</template>
<script>
export default {
    
}
</script>