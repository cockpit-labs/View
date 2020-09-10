import { http } from '@/plugins/http'
import { i18n } from '@/plugins/i18n'
import { difference } from 'lodash'
import Target from '@/models/Target'

const state = {
  selectedTargetId: null
}

const mutations = {
  setSelectedTargetId (state, targetId) {
    state.selectedTargetId = targetId
  },
  resetSelectedTarget (state) {
    state.selectedTargetId = null
  }
}

const actions = {
  async getTargets (context, { right }) {
    const targets = await http.get('targets', {
      params: {
        right
      }
    })
    const tree = setOneRoot(buildTree(setRootsToNull(targets.data.map(t => transform(t)))))
    try {
      await Target.create({ data: tree })

      const targetIds = targets.data.map(t => t.id)
      if (!targetIds.includes(context.state.selectedTargetId)) {
        context.commit('setSelectedTargetId', null)
      }

      if (context.state.selectedTargetId === null && tree.length === 1) {
        context.commit('setSelectedTargetId', tree[0].id)
      }

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default {
  state,
  mutations,
  actions
}

function transform (target) {
  return {
    id: target.id,
    name: target.name,
    parentId: target.parent
  }
}

function setOneRoot (tree) {
  if (tree.length > 1) {
    const treeWithOneRoot = tree.reduce(
      (root, node) => {
        node.parentId = root.id
        root.children.push(node)
        return root
      },
      { id: 'root', name: i18n.t('target.root'), parentId: null, children: [] }
    )
    return [treeWithOneRoot]
  } else {
    return tree
  }
}

function setRootsToNull (targets) {
  const rootsId = findRootTargets(targets)

  return targets.map(target => {
    if (rootsId.includes(target.parentId)) {
      target.parentId = null
    }
    return target
  })
}

function findRootTargets (targets) {
  const ids = []
  const parents = []

  targets.forEach(target => {
    ids.push(target.id)
    parents.push(target.parentId)
  })

  const rootsId = difference(parents, ids)
  return rootsId
}

function buildTree (flat) {
  // https://hackernoon.com/you-might-not-need-that-recursive-function-in-javascript-275651522185
  const tree = [...flat]
  const root = []
  const map = {}

  tree.forEach(node => {
    if (!node.parentId) return root.push(node)

    let parentIndex = map[node.parentId]
    if (typeof parentIndex !== 'number') {
      parentIndex = tree.findIndex(el => el.id === node.parentId)
      map[node.parentId] = parentIndex
    }

    if (!tree[parentIndex].children) {
      tree[parentIndex].children = [node]
      return tree
    }

    tree[parentIndex].children.push(node)
  })

  return root
}
