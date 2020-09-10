import Vue from 'vue'
import Vuex from 'vuex'
import targets from './modules/targets'
import folders from './modules/folders'
import VuexORM from '@vuex-orm/core'
import Target from '@/models/Target'
import TplFolder from '@/models/TplFolder'
import TplFolderTarget from '@/models/TplFolderTarget'
import Folder from '@/models/Folder'

Vue.use(Vuex)

const database = new VuexORM.Database()
database.register(Target)
database.register(TplFolder)
database.register(TplFolderTarget)
database.register(Folder)

export default new Vuex.Store({
  state: {
    filterDateStart: null,
    filterDateEnd: null,
    periodSelectorValue: {
      selectedPeriod: null,
      dateStart: null,
      dateEnd: null
    }
  },

  mutations: {
    setFilterDateStart (state, date) {
      state.filterDateStart = date
    },
    setFilterDateEnd (state, date) {
      state.filterDateEnd = date
    },
    resetDateFilters (state) {
      state.filterDateStart = null
      state.filterDateEnd = null
    },
    setPeriodSelectorValue (state, object) {
      state.periodSelectorValue = object
    }
  },

  modules: {
    targets,
    folders
  },

  plugins: [VuexORM.install(database)]
})
