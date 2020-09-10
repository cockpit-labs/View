<template>
  <div class="page-questionnaire">
    <template v-if="questionnaire">
    <QuestionnaireHeader>
      <template #action-left>
        <SButtonIcon icon="chevron-left" :label="$t('previousPage')" color="neutral" @click="goToPrevPage" />
      </template>
      {{ selectedTarget.name }} <SIcon name="caret-right" /> {{ questionnaire.label }}
    </QuestionnaireHeader>

    <Questionnaire :questionnaire="questionnaire" />

    <div class="questionnaire-footer">
      <SButton ghost @click="saveFolder" :disabled="saving">
        <template v-if="saving">{{ $t('questionnaire.saving') }}</template>
        <template v-else>{{ $t('questionnaire.save') }}</template>
      </SButton>

      <div class="right">
        <SButton v-if="nextQuestionnaire"  @click="goToNextQuestionnaire">{{ $t('next') }}</SButton>
        <SButton v-else @click="submitFolder" :disabled="submitting">
          <template v-if="submitting">{{ $t('questionnaire.submitting') }}</template>
          <template v-else>{{ $t('questionnaire.submit') }}</template>
        </SButton>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import QuestionnaireHeader from '@/components/QuestionnaireHeader'
import Questionnaire from '@/components/Questionnaire'
import Folder from '@/models/Folder'
import Target from '@/models/Target'

export default {
  components: {
    QuestionnaireHeader,
    Questionnaire
  },

  props: ['folderId', 'questionnaireNumber'],

  data () {
    return {
      saving: false,
      submitting: false
    }
  },

  computed: {
    folder () {
      if (this.folderId) {
        return Folder.find(this.folderId)
      }
      return null
    },

    questionnaire () {
      if (this.folder && this.folder.questionnaires) {
        return this.folder.questionnaires[this.questionnaireNumber - 1]
      }
      return null
    },

    nextQuestionnaire () {
      const questionnaire = this.folder.questionnaires[this.questionnaireNumber]
      if (questionnaire) {
        return true
      }
      return false
    },

    prevQuestionnaire () {
      const questionnaire = this.folder.questionnaires[this.questionnaireNumber - 2]
      if (questionnaire) {
        return true
      }
      return false
    },

    questionnaireTargetId () {
      if (this.folder && this.folder.targetId) {
        return this.folder.targetId
      }
      return null
    },

    selectedTarget () {
      if (this.questionnaireTargetId) {
        return Target
          .query()
          .whereId(this.questionnaireTargetId)
          .first()
      } else {
        return null
      }
    }
  },

  methods: {
    async saveFolder () {
      this.saving = true
      await this.$store.dispatch('saveFolder', this.folder)
      console.log('saved')
      this.saving = false
    },

    async submitFolder () {
      this.submitting = true
      await this.$store.dispatch('saveFolder', this.folder)
      await this.$store.dispatch('submitFolder', this.folder)
      console.log('submitted')
      this.submitting = false
      this.$router.push({ name: 'home' })
    },

    goToNextQuestionnaire () {
      const questionnaireNumber = Number(this.questionnaireNumber) + 1
      this.$router.push({ name: 'questionnaire', params: { folderId: this.folderId, questionnaireNumber } })
    },

    goToPrevQuestionnaire () {
      const questionnaireNumber = Number(this.questionnaireNumber) - 1
      this.$router.push({ name: 'questionnaire', params: { folderId: this.folderId, questionnaireNumber } })
    },

    goToPrevPage () {
      if (Number(this.questionnaireNumber) === 1) {
        this.$router.push({ name: 'home' })
      } else {
        this.goToPrevQuestionnaire()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-questionnaire {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // margin-bottom: 92px;
}

.questionnaire {
  flex: 1;
  margin-top: 32px;
  padding: 64px 16px 0;
  overflow-y: auto;
}

.questionnaire-header .title .s-icon {
  margin: 0 4px;
}

.questionnaire-footer {
  position: relative;
  width: 100vw;
  background-color: var(--color-n-000);
  padding: 16px 24px 32px 24px;
  box-shadow: 0 -2px 4px rgba($color: #000000, $alpha: 0.08);
  display: flex;
  box-sizing: border-box;

  .right {
    display: flex;
    margin-left: auto;
  }

  .right .s-button-text {
    margin-right: 4px;
  }
}

.desktop {
  .right .s-button-text {
    margin-right: 32px;
  }
}
</style>
