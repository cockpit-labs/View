<template>
  <div class="content">
    <portal to="filters">
      <TargetSelector :loading="loadingTargets" :expanded="targetSelectorExpanded" />
    </portal>

    <div class="folders" ref="folders">
      <template v-if="loadingTplFolders === false && selectedTargetId">
        <SListCard
          v-for="draft in draftFolders"
          :key="draft.id"
          :list="draft.questionnaires"
          @click="goToQuestionnaire(draft)"
        >
          <template #title>{{draft.label}}</template>
          <template #body>{{draft.description}}</template>
          <template #list>
            <router-link
              v-for="(questionnaire, i) in draft.questionnaires"
              :key="questionnaire.id"
              :to="{name:'questionnaire', params: {folderId: draft.id, questionnaireNumber: i + 1}}"
              class="questionnaire-link"
            >
              <span>{{ questionnaire.label }}</span>
              <SIcon name="angle-right" />
            </router-link>
          </template>
          <template #footer>{{ $tc('questionnairesPage.remainingDays', remainingDays(draft.availableUntil)) }}</template>
          <template #action-label>{{ $t('questionnairesPage.continue') }}</template>
        </SListCard>

        <SListCard
          v-for="folder in availableTemplateFolders"
          :key="folder.id"
          :list="folder.questionnaires"
          @click="instantiateFolder(selectedTargetId, folder.id)"
        >
          <template #title>{{folder.label}}</template>
          <template #body>{{folder.description}}</template>
          <template #list>
            <div
              v-for="(questionnaire, i) in folder.questionnaires"
              :key="questionnaire.id"
              class="questionnaire-link"
              @click="instantiateFolder(selectedTargetId, folder.id, i + 1)"
            >
              <span>{{ questionnaire.label }}</span>
              <SIcon name="angle-right" />
            </div>
          </template>
          <template #footer>{{ $tc('questionnairesPage.remainingDays', remainingDays(folder.availableUntil)) }}</template>
          <template #action-label>{{ $t('questionnairesPage.start') }}</template>
        </SListCard>
      </template>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import TargetSelector from '@/components/TargetSelector'
import Target from '@/models/Target'

export default {
  name: 'home',

  components: {
    TargetSelector
  },

  data () {
    return {
      loadingTargets: false,
      loadingTplFolders: false
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
          .with('folders', query => {
            query.where('state', 'DRAFT')
          })
          .first()
      } else {
        return null
      }
    },
    availableTemplateFolders () {
      if (this.selectedTarget) {
        return this.selectedTarget.tplFolders.filter(folder => {
          const draftTplFolderIds = this.draftFolders.flatMap(t => t.folderUri)
          return !draftTplFolderIds.includes('/core/api/folder_tpls/' + folder.id)
        })
      } else {
        return null
      }
    },

    draftFolders () {
      if (this.selectedTarget) {
        return this.selectedTarget.folders
      } else {
        return null
      }
    },

    targetSelectorExpanded () {
      return this.selectedTargetId === null || (this.$mq !== 'mobile' && this.$mq !== 'tablet')
    }
  },

  methods: {
    remainingDays (dateString) {
      const diff = DateTime.fromISO(dateString).diffNow().as('days')
      return diff < 1 ? 1 : Math.ceil(diff)
    },

    goToQuestionnaire (draftFolder) {
      this.$router.push({
        name: 'questionnaire',
        params: { folderId: draftFolder.id, questionnaireNumber: 1 }
      })
    },

    async instantiateFolder (targetId, templateFolderId, goToQuestionnaire = 1) {
      const newFolder = await this.$store.dispatch('instantiateFolder', { targetId, templateFolderId })
      console.log(newFolder)

      this.$router.push({
        name: 'questionnaire',
        params: { folderId: newFolder.id, questionnaireNumber: goToQuestionnaire }
      })
    }
  },

  mounted () {
    this.loadingTargets = true
    this.loadingTplFolders = true
    Promise.all([
      this.$store.dispatch('getTargets', { right: 'CREATE' }),
      this.$store.dispatch('getFolders', { right: 'CREATE' })
    ]).finally(() => {
      this.loadingTargets = false
      this.loadingTplFolders = false
    })
  }
}
</script>

<style lang="scss" scoped>
.home {
  box-sizing: border-box;
  // height: 100%;
  // overflow: hidden;
}

.container {
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 1fr;
  // padding: 40px 16px 0;
  // height: 100%;
  box-sizing: border-box;
  // overflow-x: auto;
  // overflow-y: hidden;
  // scroll-snap-type: x mandatory;
}

.targets {
  display: flex;
  flex-direction: column;
  // overflow: hidden;
  padding: 24px 16px;
  box-sizing: border-box;
  // scroll-snap-align: start;
}

// .target-selector {
//   overflow: hidden;
//   padding: 8px;
// }

.folders {
  box-sizing: border-box;
  // padding: 24px 16px 0;
  scroll-snap-align: start;
  overflow-y: auto;
}

.s-list-card {
  margin-left: auto;
  margin-right: auto;
}

.questionnaire-link {
  display: flex;
  align-items: center;
  color: var(--color-p-500);
  font-size: 16px;
  font-weight: $fw-semibold;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 8px;

  &:hover {
    color: var(--color-p-900);
    background-color: var(--color-p-100);
  }

  .s-icon {
    margin-left: auto;
    margin-right: 8px;
    transition: margin-right 150ms ease-in;
  }

  &:hover .s-icon {
    margin-right: 4px;
  }
}

.desktop {
  .container {
    grid-template-columns: minmax(auto, 380px) 1fr;
    grid-column-gap: 64px;
    padding: 0 58px;
  }

  .go-targets {
    display: none;
  }
}
</style>
