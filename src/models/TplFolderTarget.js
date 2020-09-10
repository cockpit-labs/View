import { Model } from '@vuex-orm/core'

class TplFolderTarget extends Model {
  static entity = 'tpl_folder_target'

  static fields () {
    return {
      targetId: this.attr(null),
      tplFolderId: this.attr(null)
    }
  }
}

export default TplFolderTarget
