import { update, desimplify } from 'simplifr'
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

  if (typeof reducers === 'function') return reducers;

  var reducerPaths = Object.keys(reducers);

  return function combine(state = {}, action){
    var updatedState = {};

    reducerPaths.forEach(function(path){
      var currentPath = action.path || path;
      if (currentPath.substring(0, path.length) !== path) return;

      var reducer = reducers[path];
      if (typeof reducer === 'function') {
        var prevState = desimplify(state, currentPath);
        var nextState = reducer(prevState, action);
        if (nextState !== prevState) {
          updatedState[currentPath] = nextState;
        }
      }
    });

    if (updatedState !== {}) {
      var nextState = Object.assign({}, state);
      for (var key in updatedState) {
        update(nextState, key, updatedState[key]);
      }
      return nextState;
    } else {
      return state;
    }
  }
}