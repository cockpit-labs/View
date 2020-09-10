<template>
  <div class="questionnaire">
    <div class="wrapper">
      <div class="questionnaire-description" v-if="questionnaire.description">
        {{ questionnaire.description }}
      </div>

      <div class="block" v-for="block in questionnaire.blocks" :key="block.id">
        <div class="block-header">
          <div class="title">{{ block.label }}</div>
          <div class="description" >{{ block.description }}</div>
        </div>

        <BaseQuestion
          v-for="questionAnswer in block.questionAnswers"
          :key="questionAnswer.id"
          :question="questionAnswer.question"
          :answer="questionAnswer"
          :readOnly="readOnly"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BaseQuestion from '@/components/questions/BaseQuestion'

export default {
  props: {
    questionnaire: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },

  components: {
    BaseQuestion
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 700px;
  margin: 0 auto;
}

.questionnaire-description {
  margin-bottom: 72px;
  text-align: center;
  // max-width: 1100px;
}

.block {
  margin-bottom: 80px;
}

.block-header {
  margin-bottom: 32px;
  text-align: center;
}

.block-header .title {
  color: var(--color-n-600);
  text-transform: uppercase;
}

.block-header .description {
  margin-top: 8px;
  color: var(--color-n-500);
}
</style>
