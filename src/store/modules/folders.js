import { http } from '@/plugins/http'
import TplFolder from '@/models/TplFolder'
import TplFolderTarget from '@/models/TplFolderTarget'
import Folder from '@/models/Folder'
import { DateTime } from 'luxon'

const state = {
  selectedFolderId: null
}

const getters = {
  selectedFolder: state => {
    return TplFolder.find(state.selectedFolderId)
  }
}

const mutations = {
  setSelectedFolderId (state, folderId) {
    state.selectedFolderId = folderId
  },
  resetSelectedFolder (state) {
    state.selectedFolderId = null
  }
}

const actions = {
  async getFolders (context, { right }) {
    const [templateFolders, draftFolders] = await Promise.all([
      http.get('folder_tpls', {
        params: {
          'permissions.right': right
        }
      }),

      http.get('draftfolders')
    ])

    await Promise.all([
      TplFolder.create({
        data: templateFolders.data.map(f => {
          return {
            id: f.id,
            label: f.label,
            description: f.description,
            availableFrom: f.periodStart,
            availableUntil: f.periodEnd,
            questionnaires: f.questionnaireTpls
          }
        })
      }),
      TplFolderTarget.create({
        data: templateFolders.data.flatMap(f => f.targets.map(t => {
          return {
            targetId: t.id,
            tplFolderId: f.id
          }
        }))
      }),
      Folder.create({
        data: draftFolders.data.map(f => {
          return {
            id: f.id,
            label: f.label,
            description: f.description,
            state: f.state,
            availableFrom: f.periodStart,
            availableUntil: f.periodEnd,
            questionnaires: f.questionnaires,
            targetId: f.target,
            folderUri: f.folderTpl
          }
        })
      })
    ])
  },

  async instantiateFolder (context, params) {
    const { targetId, templateFolderId } = params
    const folderInstantiated = await http.post('folders', {
      target: targetId,
      folderTpl: '/api/folder_tpls/' + templateFolderId
    })

    const dataInserted = await Folder.insert({
      data: {
        id: folderInstantiated.data.id,
        label: folderInstantiated.data.label,
        description: folderInstantiated.data.description,
        state: folderInstantiated.data.state,
        availableFrom: folderInstantiated.data.periodStart,
        availableUntil: folderInstantiated.data.periodEnd,
        questionnaires: folderInstantiated.data.questionnaires,
        targetId: folderInstantiated.data.target,
        folderUri: folderInstantiated.data.folderTpl
      }
    })

    return Promise.resolve(dataInserted.folders[0])
  },

  async saveFolder (context, folder) {
    await http.patch('folders/' + folder.id, folder,
      { headers: { 'Content-Type': 'application/merge-patch+json' } })
    return Promise.resolve()
  },

  async submitFolder (context, folder) {
    const response = await http.patch(
      'folders/' + folder.id + '/submit',
      folder,
      { headers: { 'Content-Type': 'application/merge-patch+json' } }
    )
    console.log(response)

    await Folder.update({
      id: folder.id,
      state: 'SUBMITTED'
    })

    return Promise.resolve()
  },

  async getTplFolderPeriods ({ state }) {
    const response = await http.get(
      'folder_tpls/' + state.selectedFolderId + '/periods', {
        params: {
          fromdate: DateTime.utc().minus({ year: 1 }).startOf('day').toISO(),
          todate: DateTime.utc().endOf('day').toISO()
        }
      }
    )

    if (response.data.periods) {
      await TplFolder.update({
        id: state.selectedFolderId,
        periods: response.data.periods
      })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
