import { http } from '@/plugins/http'
import User from '@/models/User'

const actions = {
  async getUsers () {
    const users = await http.get('users')

    await User.create({ data: users.data })
  }
}

export default {
  actions
}
