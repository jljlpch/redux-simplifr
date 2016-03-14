var test = require('tape')
  , combineReducers = require('../lib').combineReducers
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
      'root.path.to.component1.data.counter': function(state, action){
        return action.type === 'increment1' ? state + 1 : state;
      },
      'root.path.to.component2.data.counter': function(state, action){
        return action.type === 'increment2' ? state + action.value : state;
      }
    });

    var s1 = reducer(initialState, { type: 'increment1' });
    t.deepEqual(s1, res1);

    var s2 = reducer(s1, { type: 'increment2', value: 10 });
    t.deepEqual(s2, res2);

    t.end();
  });
})
