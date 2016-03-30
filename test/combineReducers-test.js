var test = require('tape')
  , combineReducers = require('../lib').combineReducers
  , simplifr = require('simplifr')
  , simplify = simplifr.simplify
  , desimplify = simplifr.desimplify
;

test('combineReducers tests', function(t){

  t.test('test 2 components placed in a root with raw data', function(t){

    var reducer = combineReducers({
      'counter1': function(state, action){
        state = state || 0;
        return action.type === 'increment1' ? state + 1 : state;
      },
      'stack1': function(state, action){
        state = state || [];
        return action.type === 'push1' ? state.push(action.value) && state : state;
      },
      'counter2': function(state, action){
        state = state || 0;
        return action.type === 'increment2' ? state + action.value : state;
      },
      'stack2': function(state, action){
        state = state || [];
        return action.type === 'push2' ? state.push(action.value) && state : state;
      },
    });

    var s1 = reducer({}, {
      type: 'increment1',
      path: 'counter1'
    });
    t.deepEqual(s1, { counter1: 1 });

    var s2 = reducer(s1, {
      type: 'push1',
      path: 'stack1',
      value: 'a'
    });
    t.deepEqual(s2, { counter1: 1, stack1: ['a'] });

    var s3 = reducer(s2, {
      type: 'increment2',
      path: 'counter2',
      value: 10 });
    t.deepEqual(s3, { counter1: 1, stack1: ['a'], counter2: 10 });

    var s4 = reducer(s3, {
      type: 'push2',
      path: 'stack2',
      value: 'b'
    });
    t.deepEqual(s4, { counter1: 1, stack1: ['a'], counter2: 10, stack2: ['b'] });
    t.end();
  });

  t.test('test 2 components separated by keys with raw data', function(t){

    var reducer = combineReducers({
      'component1.counter1': function(state, action){
        state = state || 0;
        return action.type === 'increment1' ? state + 1 : state;
      },
      'component1.stack1': function(state, action){
        state = state || [];
        return action.type === 'push1' ? state.push(action.value) && state : state;
      },
      'component2.counter2': function(state, action){
        state = state || 0;
        return action.type === 'increment2' ? state + action.value : state;
      },
      'component2.stack2': function(state, action){
        state = state || [];
        return action.type === 'push2' ? state.push(action.value) && state : state;
      },
    });

    var initialState = {
      component1: {},
      component2: {}
    }
    var s1 = reducer(initialState, {
      type: 'increment1',
      path: 'component1.counter1'
    });
    t.deepEqual(s1, {
      component1: {
        counter1: 1
      },
      component2: {}
    });

    var s2 = reducer(s1, {
      type: 'push1',
      path: 'component1.stack1',
      value: 'a'
    });
    t.deepEqual(s2, {
      component1: {
        counter1: 1,
        stack1: ['a']
      },
      component2: {}
    });

    var s3 = reducer(s2, {
      type: 'increment2',
      path: 'component2.counter2',
      value: 10 });
    t.deepEqual(s3, {
      component1: {
        counter1: 1,
        stack1: ['a']
      },
      component2: {
        counter2: 10
      }
    });

    var s4 = reducer(s3, {
      type: 'push2',
      path: 'component2.stack2',
      value: 'b'
    });
    t.deepEqual(s4, {
      component1: {
        counter1: 1,
        stack1: ['a']
      },
      component2: {
        counter2: 10,
        stack2: ['b']
      }
    });
    t.end();
  });

  t.test('test 2 deep counters with simplified data', function(t){
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
        return action.type === 'increment1' ? state + 1 : state;
      },
      'root.path.to.component2': function(state, action){
        return action.type === 'increment2' ? state + action.value : state;
      }
    });

    var s1 = reducer(simplify(initialState), {
      type: 'increment1',
      path: 'root.path.to.component1.data.counter',
      isSimplified: true
    });
    t.deepEqual(desimplify(s1), res1);

    var s2 = reducer(s1, {
      type: 'increment2',
      path: 'root.path.to.component2.data.counter',
      isSimplified: true,
      value: 10 });
    t.deepEqual(desimplify(s2), res2);

    t.end();
  });

  t.test('test 2 deep components with raw data', function(t){
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
        return action.type === 'increment1' ? state + 1 : state;
      },
      'root.path.to.component2': function(state, action){
        return action.type === 'increment2' ? state + action.value : state;
      }
    });

    var s1 = reducer(initialState, {
      type: 'increment1',
      path: 'root.path.to.component1.data.counter'
    });
    t.deepEqual(s1, res1);

    var s2 = reducer(s1, {
      type: 'increment2',
      path: 'root.path.to.component2.data.counter',
      value: 10 });
    t.deepEqual(s2, res2);

    t.end();
  });

})
