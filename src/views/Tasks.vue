<template>
  <div class="content">
    <portal to="filters">
      <SSelect
        v-model="selectedFilter"
        :options="filters"
      />

      <SSwitch class="switch" v-model="selectedTaskState" :options="taskStates" />
    </portal>

    <div class="tasks">
      <div v-show="noData" class="loading">{{ $t('tasks.noTask') }}</div>
      <div v-if="loading" class="loading">{{ $t('loading') }}</div>
      <div v-else class="task-list">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :mode="getMode(task)"
          @done="setTaskDone(task)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskItem from '@/components/TaskItem'

export default {
  components: {
    TaskItem
  },

  data () {
    return {
      loading: false,
      filters: [
        { id: 'todo', label: this.$t('tasks.filterAssignedToMe') },
        { id: 'follow', label: this.$t('tasks.filterTasksFollowed') },
        { id: 'author', label: this.$t('tasks.filterCreateByMe') }
      ],
      selectedFilter: ['todo'],
      taskStates: [
        { id: 'SUBMITTED', label: this.$t('tasks.toDo') },
        { id: 'DONE', label: this.$t('tasks.done') }
      ],
      selectedTaskState: 'SUBMITTED'
    }
  },

  computed: {
    tasks () {
      return this.$store.getters.tasksByDueDate
    },

    noData () {
      return !this.loading && this.tasks.length === 0
    }
  },

  methods: {
    async loadTasks (filterCode, username, state) {
      this.loading = true
      await this.$store.dispatch('getTasksByFilter', { filterCode, username, state })
      this.loading = false
    },

    setTaskDone (task) {
      this.$store.dispatch('setTaskDone', { taskId: task.id })
    },

    getMode (task) {
      if (task.responsible.username === this.$keycloak.userName) {
        return 'write'
      }
      return 'read'
    }
  },

  watch: {
    selectedFilter: {
      async handler (newValue) {
        this.loadTasks(newValue[0], this.$keycloak.userName, this.selectedTaskState)
      },
      immediate: true
    },

    selectedTaskState: {
      async handler (newValue) {
        this.loadTasks(this.selectedFilter[0], this.$keycloak.userName, this.selectedTaskState)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.switch::v-deep {
  margin-top: 8px;
}

.loading {
  text-align: center;
}

.task-item {
  margin-left: auto;
  margin-right: auto;
}
</style>
