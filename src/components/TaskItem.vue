<template>
  <div class="task-item" @click="clickTask">
    <div class="header">
      <div class="due-date" v-if="task.dueDate">{{ formatValue(task.dueDate) }}</div>
      <div class="due-date" v-else>{{ $t('tasks.noDueDate') }}</div>
      <SIcon name="trash" fw  v-if="isEditMode" class="delete" @click.native="deleteTask" />
    </div>
    <div class="description">{{ task.action }}</div>
    <div class="footer">
      <div class="assignedTo">
        <UserBadge v-if="!isEditMode" :user="task.responsible" />
      </div>

      <div class="actions">
        <transition name="move" mode="out-in">
          <div v-if="isEditMode" class="action" key="edit">
            <div class="edit" @click.stop="editTask">{{ $t('tasks.edit') }} <SIcon name="pen" fw /></div>
          </div>
          <div v-else-if="isReadMode" class="action" key="read">
            <div class="done" v-if="isDone">{{ $t('tasks.done') }}</div>
            <div class="done" v-else>{{ $t('tasks.toDo') }}</div>
          </div>
          <div v-else-if="donePending && !isDone" class="action" key="pending">
            <div class="confirm">{{ $t('tasks.confirmDone') }}
              <button class="mini-btn" @click.stop="setTaskDone">{{ $t('yes') }}</button>
              <button class="mini-btn" @click.stop="donePending = false">{{ $t('no') }}</button>
            </div>
          </div>
          <div v-else class="action" key="done">
            <div class="done" v-if="isDone">{{ $t('tasks.done') }} <SIcon name="check-circle" fw /></div>
            <div class="done active" v-else @click.stop="donePending = true">{{ $t('tasks.toDo') }} <SIcon name="circle" fw regular /></div>
          </div>
        </transition>
      </div>
    </div>

    <ModalView ref="taskDetails">
      <template #title>{{ $tc('tasks.title') }}</template>

      <div class="modal-description">{{ task.action }}</div>

      <div class="field">
        <div class="title">{{ $t('tasks.dueDate') }}</div>
        <div v-if="task.dueDate">{{ formatValue(task.dueDate) }}</div>
        <div v-else>{{ $t('tasks.noDueDate') }}</div>
      </div>

      <div class="field">
        <div class="title">{{ $t('tasks.assignTo') }}</div>
        <UserBadge full :user="task.responsible" />
      </div>

      <div class="field">
        <div class="title">{{ $t('tasks.followers') }}</div>
        <div v-if="task.informed.length > 0" class="followers">
          <UserBadge full v-for="user in task.informed" :key="user.id" :user="user" />
        </div>
        <div v-else>{{ $t('none') }}</div>
      </div>

      <template #footer>
        <div class="status">
          <template v-if="isReadMode">
            <div class="modal-done done" v-if="isDone">{{ $t('tasks.done') }}</div>
            <div class="modal-done done" v-else>{{ $t('tasks.toDo') }}</div>
          </template>
          <template v-else>
            <div class="modal-done done" v-if="isDone">{{ $t('tasks.done') }} <SIcon name="check-circle" fw /></div>
            <div class="modal-done done active" v-else @click.stop="setTaskDone">{{ $t('tasks.toDo') }} <SIcon name="circle" fw regular /></div>
          </template>
        </div>
      </template>
    </ModalView>
  </div>
</template>

<script>
import UserBadge from '@/components/UserBadge'
import ModalView from '@/components/ModalView'
import { DateTime } from 'luxon'

export default {
  name: 'TaskItem',

  components: {
    UserBadge,
    ModalView
  },

  props: {
    task: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'write',
      validator: function (value) {
        return ['edit', 'read', 'write'].indexOf(value) !== -1
      }
    }
  },

  data () {
    return {
      donePending: false
    }
  },

  computed: {
    isDone () {
      return this.task.state === 'DONE'
    },

    isEditMode () {
      return this.mode === 'edit'
    },

    isReadMode () {
      return this.mode === 'read'
    }
  },

  methods: {
    formatValue (datetime) {
      return DateTime.fromISO(datetime).toLocaleString(DateTime.DATE_MED)
    },

    setTaskDone () {
      this.$emit('done')
    },

    deleteTask () {
      this.$emit('delete')
    },

    editTask () {
      this.$emit('edit')
    },

    clickTask () {
      if (this.mode !== 'edit') {
        this.$refs.taskDetails.open()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.task-item {
  @include font-stack;
  max-width: 670px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--color-n-000);
  border-radius: 12px;
  box-shadow: 0 3px 4px rgba($color: #000000, $alpha: 0.12);
  cursor: default;
  transition: all 200ms ease-in-out;
}

.header {
  display: flex;
  align-items: center;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--color-n-100);
}

.due-date {
  font-size: 14px;
  color: var(--color-n-500);
  flex: 1;
}

.description {
  margin: 8px 0 12px;
  font-size: 16px;
  font-weight: $fw-semibold;
  color: var(--color-n-600);
}

.done {
  display: flex;
  align-items: center;
  font-variant: all-small-caps;
  font-weight: $fw-semibold;

  .s-icon {
    margin-left: 4px;
  }

  &.active:hover {
    color: var(--color-n-900);
  }
}

.delete {
  color: var(--color-n-500);

  &:hover {
    color: var(--color-s-5);
  }
}

.edit {
  display: flex;
  align-items: center;
  font-variant: all-small-caps;

  &:hover {
    color: var(--color-p-700);
  }

  .s-icon {
    margin-left: 4px;
  }
}

.mini-btn {
  @extend %button-reset;
  @include font-stack;
  padding: 4px 8px;
  margin: 0 2px;
  color: var(--color-n-000);
  background-color: var(--color-p-500);
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: var(--color-p-700);
  }
}

.modal-view {
  .modal-description {
    margin: 0 0 32px;
  }

  .field {
    margin: 16px 0;

    .title {
      font-variant: all-small-caps;
      margin-bottom: 4px;
    }
  }

  .followers {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 4px;
  }

  .modal-done {
    font-size: 18px;
  }
}

.move-enter-active, .move-leave-active {
  transition: all 300ms ease;
}

.move-enter, .move-leave-to {
  transform: translateY(8px);
  opacity: 0;
}

.desktop {
  .task-item {
    padding: 24px;
  }
}
</style>
