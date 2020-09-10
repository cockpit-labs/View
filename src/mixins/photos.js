import { http } from '@/plugins/http'
import Compressor from 'compressorjs'
import StnlDrawing from '@/plugins/stnl-drawing/stnl-drawing.esm.js'

export default {
  data () {
    return {
      collection: [],
      selectedPhotoIndex: null,
      uploading: false,
      downloading: false
    }
  },

  methods: {
    async handleFile () {
      const file = this.$refs.file.files[0]

      if (file) {
        this.uploading = true
        const blob = await this.resize(file)
        const id = await this.upload(blob)
        const imageUrl = URL.createObjectURL(blob)
        const img = new Image()
        img.height = 90
        img.src = imageUrl

        this.collection.push({ id, img })
        this.$set(this.localValue, this.localValue.length, id)

        this.$refs.file.value = ''
        this.uploading = false
      }
    },

    async download (id) {
      try {
        const response = await http.get('user_media/' + id + '/content', {
          responseType: 'blob'
        })
        return Promise.resolve(response.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async upload (file) {
      const formData = new FormData()
      formData.append('file', file, file.name)

      try {
        const response = await http.post('user_media',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
            // onUploadProgress: progressEvent => {
            //   const { loaded, total } = progressEvent
            //   const percentCompleted = parseInt(Math.round((loaded / total) * 100))
            //   console.log(percentCompleted)
            // }
          }
        )
        return Promise.resolve(response.data.id)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async deletePhoto (index) {
      this.$refs.viewer.close()
      const photo = this.collection[index]
      URL.revokeObjectURL(photo.img.src)
      this.$delete(this.collection, index)
      this.$delete(this.localValue, index)
      this.selectedPhotoIndex = null
    },

    async resize (file) {
      return new Promise((resolve, reject) => {
        /* eslint-disable no-new */
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 4096,
          success (result) {
            resolve(result)
          },
          error (e) {
            reject(e)
          }
        })
      })
    },

    async saveEditedImage (base64) {
      this.uploading = true
      // convert base64 to blob
      const response = await fetch(base64)
      const blob = await response.blob()

      await this.deletePhoto(this.selectedPhotoIndex)

      const id = await this.upload(blob)
      const imageUrl = URL.createObjectURL(blob)
      const img = new Image()
      img.height = 90
      img.src = imageUrl

      this.collection.push({ id, img })
      this.$set(this.localValue, this.localValue.length, id)

      this.uploading = false
    },

    viewPhoto (index) {
      this.selectedPhotoIndex = index
      this.$refs.viewer.open()
    },

    launchEditor () {
      this.$refs.viewer.close()
      new StnlDrawing(this.collection[this.selectedPhotoIndex].img.src, this.saveEditedImage)
    },

    reset () {
      this.collection.forEach(photo => URL.revokeObjectURL(photo.img.src))
      this.collection.splice(0, this.collection.length)
      this.localValue.splice(0, this.localValue.length)
      this.selectedPhotoIndex = null
      this.$emit('close')
    }
  },

  watch: {
    localValue: {
      handler: function (value) {
        const photoIds = this.collection.map(photo => photo.id)
        this.downloading = true
        if (Array.isArray(value)) {
          value.forEach(async iri => {
            const id = iri.substring(iri.lastIndexOf('/') + 1)
            if (photoIds.find(photoId => photoId === id) === undefined) {
              const blob = await this.download(id)
              const imageUrl = URL.createObjectURL(blob)
              const img = new Image()
              img.height = 90
              img.src = imageUrl

              this.collection.push({ id, img })
            }
          })
        }
        this.downloading = false
      },
      immediate: true
    }
  },

  beforeDestroy () {
    this.collection.forEach(photo => URL.revokeObjectURL(photo.img.src))
  }
}
