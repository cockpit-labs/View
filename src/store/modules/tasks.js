import { http } from '@/plugins/http'

const state = {
  tasks: []
}

const getters = {
  tasksByDueDate: state => {
    return state.tasks.sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
  }
}

const mutations = {
  setTasks (state, tasks) {
    state.tasks = tasks
  },

  updateStatus (state, { id, status }) {
    const task = state.tasks.find(t => t.id === id)
    task.state = status
  }
}

const actions = {
  async getTasksByFilter ({ commit }, { filterCode, username, state }) {
    switch (filterCode) {
      case 'author':
        commit('setTasks', await getTasksCreatedByUser(username, state))
        break
      case 'follow':
        commit('setTasks', await getTasksFollowedBy(username, state))
        break
      case 'todo':
        commit('setTasks', await getTasksAssignedTo(username, state))
        break
      default:
        commit('setTasks', await getTasks())
    }
  },

  async setTaskDone ({ commit }, { taskId }) {
    await http.patch(
      'tasks/' + taskId + '/done',
      {},
      { headers: { 'Content-Type': 'application/merge-patch+json' } }
    )

    commit('updateStatus', { id: taskId, status: 'DONE' })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

async function getTasks () {
  const tasks = await http.get('tasks')
  return tasks.data
}

async function getTasksCreatedByUser (username, state) {
  const tasks = await http.get('tasks', {
    params: {
      createdBy: username,
      state
    }
  })

  return tasks.data
}

async function getTasksFollowedBy (username, state) {
  const tasks = await http.get('tasks', {
    params: {
      informedIds: username,
      state
    }
  })

  return tasks.data
}

async function getTasksAssignedTo (username, state) {
  const tasks = await http.get('tasks', {
    params: {
      responsibleId: username,
      state
    }
  })

  return tasks.data
}
