var test = require('tape')
  , combineReducers = require('../lib').combineReducers
  , simplify = require('simplifr').simplify
  , desimplify = require('simplifr').desimplify
;

test('combineReducers tests', function(t){

  t.test('test 2 deep components ', function(t){
    var initialState = {
      path: {
        to: {
          component1: {
            data: {
              counter: 0
            }
          },
          component2: {
            data: {
              counter: 0
            }
          }
        }
      }
    };
    var res1 = {
      path: {
        to: {
          component1: {
            data: {
              counter: 1
            }
          },
          component2: {
            data: {
              counter: 0
            }
          }
        }
      }
    };
    var res2 = {
      path: {
        to: {
          component1: {
            data: {
              counter: 1
            }
          },
          component2: {
            data: {
              counter: 10
            }
          }
        }
      }
    }

    var reducer = combineReducers({
      'root.path.to.component1': function(state, action){
        return action.type === 'increment1'
          ? Object.assign({}, state, { [action.path]: state[action.path] + 1})
          : state;
      },
      'root.path.to.component2': function(state, action){
        return action.type === 'increment2'
          ? Object.assign({}, state, { [action.path]: state[action.path] + action.value })
          : state;
      }
    });

    var s1 = reducer(simplify(initialState), {
      type: 'increment1',
      path: 'root.path.to.component1.data.counter'
    });
    t.deepEqual(desimplify(s1), res1);

    var s2 = reducer(s1, {
      type: 'increment2',
      path: 'root.path.to.component2.data.counter',
      value: 10 });
    t.deepEqual(desimplify(s2), res2);

    t.end();
  });
})
