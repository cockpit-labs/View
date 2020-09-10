<template>
  <div class="page-filters">
    <div class="form">
      <TargetSelector :loading="loadingTargets" />
      <SSelect
        ref="selectQuestionnaire"
        v-model="localSelectedTplFolderId"
        :loading="loadingTplFolders"
        :options="templateFolders"
        :placeholder="$t('placeholder.selectQuestionnaire')"
        :disabled="templateFolders.length === 0"
      />
      <PeriodSelector
        v-show="selectedTplFolderPeriods"
        v-model="periodSelectorValue"
        :loading="loadingPeriods"
        :periods="selectedTplFolderPeriods"
      />
    </div>
  </div>
</template>

<script>
import TargetSelector from '@/components/TargetSelector'
import Target from '@/models/Target'
import TplFolder from '@/models/TplFolder'
import PeriodSelector from '@/components/PeriodSelector'
import { DateTime } from 'luxon'

export default {
  components: {
    TargetSelector,
    PeriodSelector
  },

  data () {
    return {
      periodSelectorValue: this.$store.state.periodSelectorValue,
      loadingPeriods: false,
      loadingTargets: false,
      loadingTplFolders: false,
      localSelectedTplFolderId: null
    }
  },

  computed: {
    selectedTargetId () {
      return this.$store.state.targets.selectedTargetId
    },

    selectedTarget () {
      if (this.selectedTargetId) {
        return Target
          .query()
          .whereId(this.selectedTargetId)
          .with('tplFolders')
          .first()
      } else {
        return null
      }
    },

    selectedTplFolderId () {
      return this.$store.state.folders.selectedFolderId
    },

    selectedTplFolder () {
      return this.$store.getters.selectedFolder
    },

    selectedTplFolderPeriods () {
      return this.selectedTplFolder ? this.selectedTplFolder.periods : null
    },

    templateFolders () {
      return TplFolder.all()
    }
  },

  methods: {
    async getTplFolderPeriods () {
      if (this.selectedTplFolder.periods === null) {
        this.loadingPeriods = true
        this.$emit('loading-start')
        await this.$store.dispatch('getTplFolderPeriods')

        if (this.selectedTplFolder.periods.length > 0) {
          const { start, end } = [...this.selectedTplFolder.periods].pop()

          this.periodSelectorValue.selectedPeriod = this.selectedTplFolder.periods.length - 1
          this.periodSelectorValue.dateStart = DateTime.fromISO(start)
          this.periodSelectorValue.dateEnd = DateTime.fromISO(end)
        }
        this.loadingPeriods = false
        this.$emit('loading-end')
      }
      this.search()
    },

    search () {
      if (this.periodSelectorValue.dateStart instanceof DateTime &&
      this.periodSelectorValue.dateEnd instanceof DateTime &&
      this.selectedTargetId &&
      this.selectedTplFolderId) {
        this.$emit('search', {
          targetId: this.selectedTargetId,
          tplFolderId: this.selectedTplFolderId,
          dateStart: this.periodSelectorValue.dateStart,
          dateEnd: this.periodSelectorValue.dateEnd
        })
      }
    },

    loadData (right) {
      return new Promise((resolve, reject) => {
        this.loadingTargets = true
        this.loadingTplFolders = true
        Promise.all([
          this.$store.dispatch('getTargets', { right }),
          this.$store.dispatch('getFolders', { right })
        ]).finally(() => {
          const tplIds = this.templateFolders.map(t => t.id)

          if (tplIds.includes(this.selectedTplFolderId)) {
            this.localSelectedTplFolderId = this.selectedTplFolderId
            this.getTplFolderPeriods()
          } else {
            this.$store.commit('setSelectedFolderId', null)
          }

          this.loadingTargets = false
          this.loadingTplFolders = false
          resolve()
        }).catch(e => {
          reject(new Error(e.message))
        })
      })
    }
  },

  watch: {
    periodSelectorValue: function (newValue) {
      this.$store.commit('setPeriodSelectorValue', newValue)
      this.search()
    },

    localSelectedTplFolderId: function (newValue) {
      if (newValue !== null) {
        this.$store.commit('setSelectedFolderId', newValue)
        this.getTplFolderPeriods()
      }
    },

    selectedTargetId: function (newValue) {
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  padding: 24px 16px;
}

.form {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  gap: 8px;
  padding-top: 8px;
}

.period-selector {
  position: fixed;
  bottom: 24px;
  left: 22px;
  right: 22px;
  z-index: 1;
}

.search-btn {
  margin: 32px auto 0;
}

.desktop {
  .form {
    gap: 16px;
    padding-top: 0;
  }

  .period-selector {
    position: unset;
    z-index: auto;
  }
}
</style>
