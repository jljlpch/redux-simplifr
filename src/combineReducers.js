/**
 * Turns an object whose values are arrays of different reducer functions,
 * into a single reducer function. It will call only those reducers, that have
 * corresponding path as a subpath of action path, and gather their results
 * into a single state object.
 *
 * @param {Object} reducers An object whose keys correspond to different
 * state paths, and values correspond to array of different reducer functions
 * that need to be combined into one.
 *
 * @returns {Function} A reducer function that invokes only reducers,
 * the path of which is a subpath for action path, and builds a state object.
 */
export default function combineReducers(reducers, options){
  var reducerPaths = Object.keys(reducers);
  reducerPaths.forEach(function(path){
    if (Object.prototype.toString.call(reducers[path]) !== '[object Array]') {
      reducers[path] = [reducers[path]];
    }
  });

  return function combine(state = {}, action){
    var nextState = {};
    reducerPaths.forEach(function(path){
      if (action.path) {
        if (action.path.substring(0, path.length) !== path) return;
      }
      var reducerList = reducers[path];
      reducerList.forEach(function(reducer){
        if (typeof reducer === 'function') {
          nextState = reducer(state, action);
        }
      });
    });
    return nextState;
  }
}