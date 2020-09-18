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
    }
  }
}
