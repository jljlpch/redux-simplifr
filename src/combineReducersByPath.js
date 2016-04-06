import { update, desimplify, join } from 'simplifr'
/**
 * Turns an object whose values are different reducer functions,
 * into a single reducer function. It will call only those reducers, that have
 * corresponding path as a subpath of action path, and gather their results
 * into a single state object.
 *
 * @param {Object} reducers An object whose keys correspond to different
 * state paths, and values correspond to different reducer functions
 * that need to be combined into one.
 *
 * @returns {Function} A reducer function that invokes only reducers,
 * the path of which is a subpath for action path, and builds a state object.
 */
export default function combineReducersByPath(reducers){

  if (typeof reducers === 'function') return reducers

  const reducerPaths = Object.keys(reducers)

  return function combine(state = {}, action, rootPath, updatedState, isChild = false ){
    rootPath = rootPath || 'root'
    updatedState = updatedState || {}

    reducerPaths.forEach(function(path){
      const nextRootPath = join(rootPath, path)
      const reducer = reducers[path]
      if (typeof reducer !== 'function') return;

      if (reducer.length > 2) {
        reducer(state, action, nextRootPath, updatedState, true)
      } else {
        const currentPath = join(nextRootPath, action.path)
        const prevState = desimplify(state, currentPath)
        const nextState = reducer(prevState, action)
        if (nextState !== prevState) {
          updatedState[currentPath] = nextState
        }
      }
    })

    if (isChild) return;

    if (updatedState !== {}) {
      let nextState = Object.assign({}, state)
      for (let key in updatedState) {
        update(nextState, key, updatedState[key])
      }
      return nextState
    } else {
      return state
    }
  }
}