<template>
  <ModalView ref="modal">
    <template #title>{{ $t('tasks.tasksToDo') }}</template>
    <template #subtitle>
      <div v-if="tasks.length > 0">{{ $tc('tasks.numberOfTasks', tasks.length) }}</div>
    </template>

    <div class="task-list" v-if="tasks.length > 0">
      <TaskItem
        v-for="(task, i) in tasks"
        :key="i"
        :task="task"
        mode="edit"
        @delete="deleteTask(i)"
        @edit="editTask(i)"
      />
    </div>

    <div class="new-task" v-show="editionMode">
      <div class="header">
        {{ $t('tasks.newTask') }}
      </div>

      <div class="input-wrapper">
        <div class="header">
          <label class="label">{{ $t('tasks.label') }}</label>
          <div class="error" v-if="formSubmitted && $v.taskEdited.action.$error && !$v.taskEdited.action.required">{{ $t('tasks.required') }}</div>
        </div>
        <input class="input" type="text" v-model.trim="$v.taskEdited.action.$model" max="250">
      </div>

      <div class="input-wrapper">
        <div class="header">
          <label class="label">{{ $t('tasks.dueDate') }}</label>
        </div>
        <SDatetime v-model="taskEdited.dueDate" />
      </div>

      <div class="input-wrapper">
        <div class="header">
          <label class="label">{{ $t('tasks.assignTo') }}</label>
          <div class="error" v-if="formSubmitted && $v.taskEdited.responsible.$error && !$v.taskEdited.responsible.required">{{ $t('tasks.required') }}</div>
        </div>
        <UserSearch v-model="$v.taskEdited.responsible.$model" />
      </div>

      <div class="input-wrapper">
        <div class="header">
          <label class="label">{{ $t('tasks.followers') }}</label>
        </div>
        <UserSearch v-model="taskEdited.followers" :max="5" />
      </div>

      <div class="footer">
        <SButton v-if="tasks.length > 0" ghost icon="times" iconPosition="left" @click="closeEditionMode">{{ $t('tasks.cancel') }}</SButton>
        <SButton v-if="taskEdited.index === null" icon="check" iconPosition="left" @click="saveNewTask">{{ $t('tasks.add') }}</SButton>
        <SButton v-else icon="check" iconPosition="left" @click="saveEditedTask">{{ $t('tasks.validate') }}</SButton>
      </div>
    </div>

    <div class="add-task" v-show="!editionMode">
      <SButton @click="addTask">{{ $t('tasks.createTask') }}</SButton>
    </div>

  </ModalView>
</template>

<script>
import ModalView from '@/components/ModalView'
import TaskItem from '@/components/TaskItem'
import UserSearch from '@/components/UserSearch'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'TaskModal',

  mixins: [validationMixin],

  components: {
    ModalView,
    TaskItem,
    UserSearch
  },

  props: ['tasks'],

  data () {
    return {
      editing: false,
      taskEdited: {
        action: null,
        dueDate: null,
        responsible: [],
        followers: [],
        index: null
      },
      formSubmitted: false
    }
  },

  validations: {
    taskEdited: {
      action: {
        required
      },
      responsible: {
        required
      }
    }
  },

  computed: {
    editionMode () {
      return this.editing || this.tasks.length === 0
    }
  },

  methods: {
    open () {
      this.$refs.modal.open()
    },

    addTask () {
      this.editing = true
    },

    closeEditionMode () {
      this.editing = false
      this.formSubmitted = false
      this.taskEdited.action = null
      this.taskEdited.dueDate = null
      this.taskEdited.responsible = []
      this.taskEdited.followers = []
      this.taskEdited.index = null
      this.$v.taskEdited.$reset()
    },

    saveNewTask () {
      if (this.$v.taskEdited.$invalid) {
        this.$v.taskEdited.$touch()
        this.formSubmitted = true
        return false
      }

      const newTask = {
        action: this.taskEdited.action,
        dueDate: this.taskEdited.dueDate.length > 0 ? this.taskEdited.dueDate : null,
        responsible: this.taskEdited.responsible[0],
        informed: this.taskEdited.followers
      }

      this.$set(this.tasks, this.tasks.length, newTask)
      this.closeEditionMode()
    },

    saveEditedTask () {
      if (this.$v.taskEdited.$invalid) {
        this.$v.taskEdited.$touch()
        this.formSubmitted = true
        return false
      }

      const task = this.tasks[this.taskEdited.index]
      task.action = this.taskEdited.action
      task.dueDate = this.taskEdited.dueDate.length > 0 ? this.taskEdited.dueDate : null
      task.responsible = this.taskEdited.responsible[0]
      task.informed = this.taskEdited.followers
      this.closeEditionMode()
    },

    deleteTask (index) {
      this.$delete(this.tasks, index)
    },

    editTask (index) {
      const task = this.tasks[index]
      this.taskEdited.action = task.action
      this.taskEdited.dueDate = task.dueDate
      this.taskEdited.responsible = [task.responsible]
      this.taskEdited.followers = task.informed
      this.taskEdited.index = index
      this.editing = true
    }
  }
}
</script>

<style lang="scss" scoped>
.add-task {
  display: flex;
  justify-content: center;
}

.new-task {
  padding: 16px 12px;
  background-color: var(--color-n-100);
  border-radius: 12px;

  > .header {
    font-variant: all-small-caps;
    font-size: 18px;
    font-weight: var(--fw-semibold);
    margin-bottom: 16px;
    text-align: center;
  }

  .footer {
    margin-top: 24px;
    display: flex;
    justify-content: space-evenly;
  }
}

.input-wrapper {
  max-width: 400px;
  margin: 0 auto 8px auto;

  &:last-child {
    margin-bottom: 0;
  }

  .header {
    display: flex;
    margin: 0 8px;
  }

  .label {
    flex: 1;
    color: var(--color-n-500);
  }

  .error {
    color: var(--color-s-5);
  }
}

.new-task .input {
  @include font-stack;
  width: 100%;
  appearance: none;
  margin: 0;
  border-radius: none;
  padding: 16px 24px;
  background-color: var(--color-n-000);
  border: none;
  border-radius: 12px;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.12);
  font-size: 16px;
  color: var(--color-n-600);
  box-sizing: border-box;
}
</style>
