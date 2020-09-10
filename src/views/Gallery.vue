<template>
  <div class="content">
    <portal to="filters">
        <PageFilters ref="galleryPageFilters" @search="searchPhotos" @loading-start="loading = true" />
    </portal>

    <div class="gallery">
      <div v-show="loading" class="loading">{{ $t('loading') }}</div>

      <div v-show="noData" class="loading">{{ $t('galleryPage.noData') }}</div>

      <div class="grid">
        <LazyImage
          class="photo"
          v-for="photo in photos"
          :key="photo.id"
          :dataSrc="photo.src"
          :height="photo.height"
          :width="photo.width"
          @selected="selectPhoto"
        />
      </div>
    </div>

    <PhotoViewer ref="viewer" :photoSrc="selectedPhoto"></PhotoViewer>
  </div>
</template>

<script>
import { http } from '@/plugins/http'
import LazyImage from '@/components/LazyImage'
import PhotoViewer from '@/components/PhotoViewer'
import qs from 'qs'
import PageFilters from '@/components/PageFilters'

export default {
  components: {
    LazyImage,
    PhotoViewer,
    PageFilters
  },

  data () {
    return {
      photos: [],
      selectedPhoto: null,
      loading: false
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
          width,
          height
        }
      })

      this.loading = false
    },

    selectPhoto (event) {
      this.selectedPhoto = event
      this.$refs.viewer.open()
    }
  },

  async mounted () {
    // portal-vue caveat
    await this.$nextTick()
    await this.$nextTick()

    await this.$refs.galleryPageFilters.loadData('VIEW')

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
.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: dense;

  .photo {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .portrait {
    grid-row: span 2;
  }
}

.loading {
  text-align: center;
}

.desktop {
  .gallery {
    overflow-y: auto;
  }
}
</style>
