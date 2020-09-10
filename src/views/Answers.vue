<template>
  <div class="content">
    <portal to="filters">
        <PageFilters ref="answersPageFilters" @search="getFoldersAnswered" @loading-start="loading = true" />
    </portal>

    <div class="answers">
      <div v-show="loading" class="loading">{{ $t('loading') }}</div>
      <div v-show="noData" class="loading">{{ $t('answersPage.noData') }}</div>

      <SListCard @click="selectFolder(folder)" v-for="folder in folders" :key="folder.id">
        <template #title>{{ folder.label }}</template>
        <template #body>
          {{ $t('answersPage.folderCreationDetails', {createdAt: formatDate(folder.updatedAt), createdBy: folder.updatedBy}) }}
        </template>
        <template #action-label>{{ $t('answersPage.viewFolderQuestionnaires') }}</template>
      </SListCard>
    </div>

    <ModalView ref="questionnaire">
      <template #title v-if="selectedFolder">{{ selectedFolder.label }}</template>
      <template #subtitle v-if="selectedFolder">
        {{ $t('answersPage.folderCreationDetails', {createdAt: formatDate(selectedFolder.updatedAt), createdBy: selectedFolder.updatedBy}) }}
      </template>

      <Questionnaire v-if="questionnaire" :questionnaire="questionnaire" :readOnly="true" />

      <template #footer v-if="selectedFolder && selectedFolder.questionnaires.length > 1">
        <SButton v-if="prevQuestionnaire" @click="goToPrevQuestionnaire">{{ $t('previous') }}</SButton>
        <SButton v-if="nextQuestionnaire"  @click="goToNextQuestionnaire">{{ $t('next') }}</SButton>
      </template>
    </ModalView>
  </div>
</template>

<script>
import PageFilters from '@/components/PageFilters'
import ModalView from '@/components/ModalView'
import Questionnaire from '@/components/Questionnaire'
import { http } from '@/plugins/http'
import qs from 'qs'
import { DateTime } from 'luxon'
import FiltersUtils from '@/mixins/filters'

export default {
  components: {
    PageFilters,
    ModalView,
    Questionnaire
  },

  mixins: [FiltersUtils],

  data () {
    return {
      loading: false,
      folders: [],
      selectedFolder: null,
      questionnaireNumber: 0
    }
  },

  computed: {
    noData () {
      return this.filtersAreFilled &&
        !this.loading &&
        this.folders.length === 0
    }
  },

  methods: {
    async getFoldersAnswered () {
      this.loading = true
      this.folders = []

      const response = await http.get('folders', {
        params: {
          target: this.selectedTargetId,
          'tplFolder.id': this.selectedTplFolderId || undefined,
          updatedAt: {
            after: this.dateStart || undefined,
            before: this.dateEnd || undefined
          }
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
      })

      this.folders = response.data
      this.loading = false
    },

    formatDate (datetime) {
      return DateTime.fromISO(datetime).toLocaleString(DateTime.DATETIME_SHORT)
    },

    selectFolder (folder) {
      this.selectedFolder = folder
      this.$refs.questionnaire.open()
    },

    goToPrevQuestionnaire () {
      this.questionnaireNumber = this.questionnaireNumber - 1
      this.$refs.questionnaire.scrollMainTop()
    },

    goToNextQuestionnaire () {
      this.questionnaireNumber = this.questionnaireNumber + 1
      this.$refs.questionnaire.scrollMainTop()
    }
  },

  async mounted () {
    // portal-vue caveat
    await this.$nextTick()
    await this.$nextTick()

    await this.$refs.answersPageFilters.loadData('VIEW')

    if (this.filtersAreFilled) {
      this.getFoldersAnswered()
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  text-align: center;
}

.answers {
  padding-bottom: 80px;
}

.s-list-card {
  margin-left: auto;
  margin-right: auto;
}
</style>
