<template>
  <div class="s-list-card">
    <div class="title">
      <!-- @slot Text for card title -->
      <slot name="title" />
    </div>
    <div class="body">
      <!-- @slot Text for card body -->
      <slot name="body" />
    </div>
    <div class="list" v-if="list && list.length > 1">
      <!-- <template v-for="(element, i) in list">
        <slot name="list" :element="element" :index="i + 1"></slot>
      </template> -->
       <slot name="list"></slot>
    </div>
    <div class="footer">
      <div class="info">
        <!-- @slot Text for card footer -->
        <slot name="footer" />
      </div>
      <SButton rounded icon="angle-right" @click="emitClick">
        <!-- @slot Footer button label -->
        <slot name="action-label" />
      </SButton>
    </div>
  </div>
</template>

<script>
import SButton from '../button/SButton'

export default {
  name: 'SListCard',

  components: {
    SButton
  },

  props: {
    list: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    emitClick (event) {
      /**
       * Click event
       *
       * @event click
       * @type {object}
       */
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.s-list-card {
    @include font-stack;
    max-width: 670px;
    padding: 24px;
    margin-bottom: 16px;
    background-color: var(--color-n-000);
    border-radius: 12px;
    box-shadow: 0 3px 4px rgba($color: #000000, $alpha: 0.12);
    cursor: default;
    transition: all 200ms ease-in-out;

    .title {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: $fw-bold;
      color: var(--color-n-600);
    }

    .body {
      font-size: 14px;
      line-height: 1.3;
      min-height: 1.3em;
      color: var(--color-n-500);
      padding-bottom: 24px;
      border-bottom: 1px solid var(--color-n-100);
    }

    .footer {
      display: flex;
      align-items: center;
      margin-top: 24px;
      padding: 0 8px;
    }

    .footer .info {
      font-size: 14px;
      color: var(--color-n-500);
    }

    .footer .s-button {
      margin-left: auto;
    }

    .list {
      padding: 8px 0;
      border-bottom: 1px solid var(--color-n-100);
    }

    &.waiting {
      pointer-events: none;
      background-color: red;
    }
}
</style>
