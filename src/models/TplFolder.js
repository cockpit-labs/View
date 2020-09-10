import { Model } from '@vuex-orm/core'

class TplFolder extends Model {
  static entity = 'tpl_folders'

  static fields () {
    return {
      id: this.attr(null),
      label: this.attr(null),
      description: this.attr(null),
      availableFrom: this.attr(null),
      availableUntil: this.attr(null),
      periods: this.attr(null),
      questionnaires: this.attr(null)
    }
  }
}

export default TplFolder
