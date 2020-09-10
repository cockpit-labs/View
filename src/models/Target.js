import { Model } from '@vuex-orm/core'
import TplFolder from './TplFolder'
import TplFolderTarget from './TplFolderTarget'
import Folder from './Folder'

class Target extends Model {
  static entity = 'targets'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(null),
      parentId: this.attr(null),
      parent: this.belongsTo(Target, 'parentId'),
      children: this.hasMany(Target, 'parentId'),
      tplFolders: this.belongsToMany(TplFolder, TplFolderTarget, 'targetId', 'tplFolderId'),
      folders: this.hasMany(Folder, 'targetId')
    }
  }
}

export default Target
