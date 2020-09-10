import Target from '@/models/Target'

export default {
  computed: {
    selectedTargetId () {
      return this.$store.state.targets.selectedTargetId
    },

    selectedTarget () {
      if (this.selectedTargetId) {
        return Target
          .query()
          .whereId(this.selectedTargetId)
          .with(['children', 'tplFolders'])
          .first()
      } else {
        return null
      }
    },

    selectedTplFolderId () {
      return this.$store.state.folders.selectedFolderId
    },

    dateStart () {
      return this.$store.state.periodSelectorValue.dateStart
        ? this.$store.state.periodSelectorValue.dateStart.toISO() : null
    },

    dateEnd () {
      return this.$store.state.periodSelectorValue.dateEnd
        ? this.$store.state.periodSelectorValue.dateEnd.endOf('day').toISO() : null
    },

    filtersAreFilled () {
      return (this.dateStart !== null) &&
        (this.dateEnd !== null) &&
        (this.selectedTargetId !== null) &&
        (this.selectedTplFolderId !== null)
    },

    questionnaire () {
      if (this.selectedFolder && this.selectedFolder.questionnaires) {
        return this.selectedFolder.questionnaires[this.questionnaireNumber]
      }
      return null
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
    }
  }
}
