import { getRaw, updateRaw } from 'simplifr'

/**
 * Turns an object whose values are arrays of different reducer functions,
 * into a single reducer function. It will call every child reducer,
 * and gather their results into a single state object, whose keya correspond
 * to the keys of passed reducer functions.
 *
 * @param {Object} reducers An object whose keys correspond to different
 * state paths, and values to array of different reducer functions
 * that need to be combined into one.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with corresponding path.
 */
export default function combineReducers(reducers){
  var reducerPaths = Object.keys(reducers);
  var finalReducers = {};
  reducerPaths.forEach(function(path){
    if (Object.prototype.toString.call(reducers[path]) !== '[object Array]') {
      reducers[path] = [reducers[path]];
    }
    finalReducers[path] = [];
    reducers[path].forEach(function(reducer){
      if (typeof reducer === 'function') {
        finalReducers[path].push(reducer);
      }
    });
  });

  var finalReducersPaths = Object.keys(finalReducers);

  return function combine(state = {}, action){
    var hasChanged = false;
    var nextState = Object.assign({}, state);
    finalReducersPaths.forEach(function(path){
      var reducerList = finalReducers[path];
      var previousStateForPath = getRaw(state, path);
      var nextStateForPath = reducerList[0](previousStateForPath, action);
      for (var i = 0, l = reducerList.length; ++i < l;){
        nextStateForPath = reducerList[i](nextStateForPath, action);
      }
      updateRaw(nextState, path, nextStateForPath);

      hasChanged = hasChanged || nextStateForPath !== previousStateForPath;
    });
    return hasChanged ? nextState : state;
  }
}