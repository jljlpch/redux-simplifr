var test = require('tape')
  , combineReducersByPath = require('../lib').combineReducersByPath
  , simplifr = require('simplifr')
  , simplify = simplifr.simplify
  , desimplify = simplifr.desimplify
;

test('combineReducersByPath tests', function(t){

  t.test('test 2 deep counters ', function(t){
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

    var reducer = combineReducersByPath({
      'root.path.to.component1': function(state, action){
        return action.type === 'increment1' ? state + 1 : state;
      },
      'root.path.to.component2': function(state, action){
        return action.type === 'increment2' ? state + action.value : state;
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
