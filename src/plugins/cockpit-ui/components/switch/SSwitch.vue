<template>
  <div class="s-switch">
    <div class="selector" :style="selectorPosition"></div>
    <div
      v-for="option in options"
      :key="option.id"
      :class="['option', {selected: option.id === value}]"
      @click="selectOption(option.id, $event)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SSwitch',

  props: {
    value: [String, Number],
    options: Array
  },

  data () {
    return {
      selectorPosition: {
        width: '160px',
        left: '8px'
      },
      transitionActived: false
    }
  },

  methods: {
    selectOption (id, event) {
      this.moveSelector(event.target)
      this.$emit('input', id)
    },

    moveSelector (element) {
      this.selectorPosition.width = element.offsetWidth + 'px'
      this.selectorPosition.left = element.offsetLeft + 'px'
    }
  },

  mounted () {
    const selectedOption = this.$el.querySelector('.selected')
    this.moveSelector(selectedOption)
  }
}
</script>

<style lang="scss" scoped>
.s-switch {
  @include font-stack;
  position: relative;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 3px 4px rgba($color: #000000, $alpha: 0.12);
  display: flex;
  gap: 8px;
  padding: 8px;
  color: var(--color-n-800);
  font-weight: $fw-semibold;
  background-color: var(--color-n-000);
  cursor: default;
  transition: all 150ms ease-in;

  &.disabled {
    pointer-events: none;
    box-shadow: none;
  }
}

.option {
  flex: 1;
  padding: 8px;
  text-align: center;
  border-radius: 8px;
  z-index: 1;
}

.selector {
  position:absolute;
  height: calc(100% - 16px);
  width: 162px;
  left: 8px;
  top: 8px;
  z-index: 1;
  border-radius: 8px;
  background-color: var(--color-n-100);
  transition: all 300ms ease-out;
}
</style>
