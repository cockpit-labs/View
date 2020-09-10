import { Model } from '@vuex-orm/core'

class Folder extends Model {
  static entity = 'folders'

  static fields () {
    return {
      id: this.attr(null),
      label: this.attr(null),
      description: this.attr(null),
      state: this.attr(null),
      availableFrom: this.attr(null),
      availableUntil: this.attr(null),
      questionnaires: this.attr(null),
      targetId: this.attr(null),
      folderUri: this.attr(null)
    }
  }
}

export default Folder
