<template>
  <ModalView ref="questionnaire">
    <template #title v-if="selectedFolder">{{ selectedFolder.label }}</template>
    <template #subtitle v-if="selectedFolder">
      {{ $t('answersPage.folderCreationDetails', {createdAt: formatDate(selectedFolder.updatedAt), createdBy: selectedFolder.updatedBy}) }}
    </template>

    <Questionnaire v-if="questionnaire" :questionnaire="questionnaire" :readOnly="true" />

    <template #footer>
      <div class="questionnaire-footer">
        <div class="tools">
          <SButtonText icon="file-pdf" @click="downloadPdf">{{ $t('downloadPdf') }}</SButtonText>
        </div>
        <div class="pagination" v-if="selectedFolder && selectedFolder.questionnaires.length > 1">
          <SButton v-if="prevQuestionnaire" @click="goToPrevQuestionnaire">{{ $t('previous') }}</SButton>
          <SButton v-if="nextQuestionnaire"  @click="goToNextQuestionnaire">{{ $t('next') }}</SButton>
        </div>
      </div>
    </template>
  </ModalView>
</template>

<script>
import ModalView from '@/components/ModalView'
import Questionnaire from '@/components/Questionnaire'
import { DateTime } from 'luxon'
import { http } from '@/plugins/http'

export default {
  components: {
    ModalView,
    Questionnaire
  },

  props: {
    selectedFolder: {
      type: Object
    }
  },

  data () {
    return {
      questionnaireNumber: 0
    }
  },

  computed: {
    questionnaire () {
      if (this.selectedFolder && this.selectedFolder.questionnaires) {
        return this.selectedFolder.questionnaires[this.questionnaireNumber]
      }
      return null
    }
  },

  methods: {
    open () {
      this.$refs.questionnaire.open()
    },

    formatDate (datetime) {
      return DateTime.fromISO(datetime).toLocaleString(DateTime.DATETIME_SHORT)
    },

    nextQuestionnaire () {
      const questionnaire = this.selectedFolder.questionnaires[this.questionnaireNumber + 1]
      if (questionnaire) {
        return true
      }
      return false
    },

    prevQuestionnaire () {
      const questionnaire = this.selectedFolder.questionnaires[this.questionnaireNumber - 1]
      if (questionnaire) {
        return true
      }
      return false
    },

    goToPrevQuestionnaire () {
      this.questionnaireNumber = this.questionnaireNumber - 1
      this.$refs.questionnaire.scrollMainTop()
    },

    goToNextQuestionnaire () {
      this.questionnaireNumber = this.questionnaireNumber + 1
      this.$refs.questionnaire.scrollMainTop()
    },

    async downloadPdf () {
      const pdfWindow = window.open('', '_blank')
      pdfWindow.document.write(this.$t('pdfLoading'))

      try {
        const dataUrl = await this.getDataUrl()
        pdfWindow.location.href = dataUrl
      } catch (error) {
        pdfWindow.document.body.innerHTML = this.$t('alert.errorOccurred')
      }

      // const a = document.createElement('a')
      // a.style = 'display: none'
      // document.body.appendChild(a)
      // a.href = dataUrl
      // a.setAttribute('download', this.questionnaire.id)
      // a.click()
      // a.remove()
      // URL.revokeObjectURL(dataUrl)
    },

    async getDataUrl () {
      try {
        const response = await http.get('questionnaires/' + this.questionnaire.id + '/pdf', {
          responseType: 'blob'
        })
        const dataUrl = URL.createObjectURL(response.data)
        return Promise.resolve(dataUrl)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.questionnaire-footer {
  display: flex;
  width: 100%;
  align-items: center;

  .tools {
    flex: 1;
    display: flex;
  }

  .pagination {
    display: flex;

    > .s-button {
      margin: 0 8px;
    }
  }
}
</style>
