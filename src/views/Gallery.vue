<template>
  <div class="content">
    <portal to="filters">
        <PageFilters ref="galleryPageFilters" @search="searchPhotos" @loading-start="loading = true" />
    </portal>

    <div class="gallery">
      <div v-show="loading" class="loading">{{ $t('loading') }}</div>

      <div v-show="noData" class="loading">{{ $t('galleryPage.noData') }}</div>

      <div class="grid">
        <div :class="['photo-container', photo.orientation]" v-for="photo in photos" :key="photo.id">
          <LazyImage
            class="photo"
            :dataSrc="photo.src"
            :height="photo.height"
            :width="photo.width"
            @selected="selectPhoto(photo, $event)"
          />
          <div class="details">
            <div class="target">{{ photo.targetName }}</div>
            <div class="date">{{ photo.createdAt }}</div>
          </div>
        </div>
      </div>
    </div>

    <PhotoViewer ref="viewer" :photoSrc="selectedPhoto">
      <template #footer>
        <div class="meta">{{ selectedPhotoMeta.createdAt }}</div>
        <div class="meta">{{ selectedPhotoMeta.targetName }}</div>
        <div class="meta">{{ selectedPhotoMeta.userFullName }}</div>
        <div class="meta" v-if="loadingFolder">{{ $t('loading') }}</div>
        <SButtonText v-else @click="showFolder(selectedPhotoMeta.folderId)">{{ $t('galleryPage.showLinkedQuestionnaire') }}</SButtonText>
      </template>
    </PhotoViewer>

    <QuestionnaireReadModal ref="questionnaireModal" :selectedFolder="folderToShow" />
  </div>
</template>

<script>
import { http } from '@/plugins/http'
import LazyImage from '@/components/LazyImage'
import PhotoViewer from '@/components/PhotoViewer'
import PageFilters from '@/components/PageFilters'
import QuestionnaireReadModal from '@/components/QuestionnaireReadModal'
import qs from 'qs'
import { DateTime } from 'luxon'
import Target from '@/models/Target'
import User from '@/models/User'

export default {
  components: {
    LazyImage,
    PhotoViewer,
    PageFilters,
    QuestionnaireReadModal
  },

  data () {
    return {
      loading: false,
      photos: [],
      selectedPhoto: null,
      selectedPhotoMeta: null,
      folderToShow: null,
      loadingFolder: false
    }
  },

  computed: {
    filtersAreFilled () {
      return (this.$store.state.periodSelectorValue.dateStart !== null) &&
        (this.$store.state.periodSelectorValue.dateEnd !== null) &&
        (this.$store.state.targets.selectedTargetId !== null) &&
        (this.$store.state.folders.selectedFolderId !== null)
    },

    noData () {
      return this.filtersAreFilled &&
        !this.loading &&
        this.photos.length === 0
    }
  },

  methods: {
    async searchPhotos (filterParams) {
      this.loading = true
      this.photos = []

      const folders = await http.get('folders', {
        params: {
          target: filterParams.targetId,
          'tplFolder.id': filterParams.tplFolderId,
          updatedAt: {
            after: filterParams.dateStart.toISO(),
            before: filterParams.dateEnd.endOf('day').toISO()
          }
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
      })

      const foldersId = folders.data.map(f => f.id)

      if (foldersId.length > 0) {
        const photos = await http.get('user_media', {
          params: {
            'owners.owner': foldersId
          },
          paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
        })

        this.photos = photos.data.map(photo => {
          const width = Number(photo.dimensions.substring(1, photo.dimensions.indexOf(',')))
          const height = Number(photo.dimensions.substring(photo.dimensions.indexOf(',') + 1, photo.dimensions.length - 1))
          return {
            id: photo.id,
            src: photo.id,
            orientation: height > width ? 'portrait' : 'landscape',
            width,
            height,
            createdAt: this.formatDate(photo.createdAt),
            targetName: Target.find(photo.target)?.name,
            userFullName: this.getFullName(User.query().where('username', photo.createdBy).first()),
            folderId: photo.folder.substring(photo.folder.lastIndexOf('/') + 1)
          }
        })
      }

      this.loading = false
    },

    selectPhoto (photo, photoSrc) {
      this.selectedPhoto = photoSrc
      this.selectedPhotoMeta = photo
      this.$refs.viewer.open()
    },

    formatDate (datetime) {
      return DateTime.fromISO(datetime).toLocaleString(DateTime.DATE_SHORT)
    },

    getFullName (user) {
      return `${user?.firstname} ${user?.lastname}`
    },

    async showFolder (folderId) {
      this.loadingFolder = true
      const folder = await http.get('folders/' + folderId)
      this.loadingFolder = false
      if (folder.data) {
        this.folderToShow = folder.data
        this.$refs.questionnaireModal.open()
      }
    }
  },

  async mounted () {
    // portal-vue caveat
    await this.$nextTick()
    await this.$nextTick()

    await this.$refs.galleryPageFilters.loadData('VIEW')

    if (User.query().count() === 0) {
      this.$store.dispatch('getUsers')
    }

    if (this.filtersAreFilled) {
      this.searchPhotos({
        targetId: this.$store.state.targets.selectedTargetId,
        tplFolderId: this.$store.state.folders.selectedFolderId,
        dateStart: this.$store.state.periodSelectorValue.dateStart,
        dateEnd: this.$store.state.periodSelectorValue.dateEnd
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery {
  padding-bottom: 150px;
}

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  grid-auto-flow: dense;
}

.photo {
  // height: 100%;
  flex: 1;
  width: 100%;
  object-fit: cover;
}

.photo-container {
  background-color: var(--color-n-000);
  border-radius: 8px;
  transition: all 200ms ease-in;
  box-shadow: 0 2px 4px rgba($color: #000000, $alpha: 0.12);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 16px rgba($color: #000000, $alpha: 0.12);
  }

  &.portrait {
    grid-row: span 2;
  }
}

.details {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.target {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.loading {
  text-align: center;
}

.meta {
  color: var(--color-n-000);
}
</style>
