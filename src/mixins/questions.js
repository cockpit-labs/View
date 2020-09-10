import { isEmpty } from 'lodash'

export default {
  methods: {
    getChoices () {
      if (isEmpty(this.answer.answerValues)) {
        return null
      }
      return this.answer.answerValues.map(v => v.choice)
    },

    setChoices (choices) {
      if (choices === null) {
        this.answer.answerValues = []
      } else if (Array.isArray(choices)) {
        this.answer.answerValues = choices.map(v => {
          return { choice: v }
        })
      } else {
        this.answer.answerValues = [{ choice: choices }]
      }

      this.emitUpdate()
    },

    getRawValue () {
      if (isEmpty(this.answer.answerValues)) {
        return null
      }
      const rawValues = this.answer.answerValues.map(v => v.rawValue)
      return rawValues.length === 1 ? rawValues[0] : rawValues
    },

    setRawValue (value) {
      if (value !== null) {
        value = String(value)
      }
      if (isEmpty(this.answer.answerValues)) {
        this.answer.answerValues = [{ rawValue: value }]
      }
      this.answer.answerValues[0].rawValue = value
      this.emitUpdate()
    },

    emitUpdate () {
      this.$emit('update:answer', this.answer)
    }
  }
}
