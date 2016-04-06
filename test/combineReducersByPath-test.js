'use strict'
let test = require('tape')

import { combineReducersByPath } from '../lib'
import { simplify, desimplify} from 'simplifr'

test('combineReducersByPath tests', t => {

  t.test('take reducer function as argument should return the same function ', t => {
    const initialState = {
      path: {
        to: {
          component: {
            counter: 0
          }
        }
      }
    }

    const reducer1 = (state, action) =>
      action.type === 'increment' ? Object.assign({}, state, { [action.path]: state[action.path] + action.value }) : state

    const reducer = combineReducersByPath(reducer1)

    let s1 = reducer(simplify(initialState), { type: 'increment', path: 'root.path.to.component.counter', value: 10 })
    t.deepEqual(desimplify(s1), { path: { to: { component: { counter: 10 } } } })

    t.end()
  })
  t.test('test 2 deep components with the same reducer ', t => {
    const initialState = {
      path: {
        to: {
          component1: {
            counter: 0,
            stack: []
          },
          component2: {
            counter: 0,
            stack: []
          }
        }
      }
    }
    let res1 = {
      path: {
        to: {
          component1: {
            counter: 1,
            stack: []
          },
          component2: {
            counter: 1,
            stack: []
          }
        }
      }
    }
    let res2 = {
      path: {
        to: {
          component1: {
            counter: 1,
            stack: ['a']
          },
          component2: {
            counter: 1,
            stack: ['a']
          }
        }
      }
    }

    const childReducer = combineReducersByPath({
      'counter': (state, action) => action.type === 'increment' ? state + 1 : state,
      'stack': (state, action) => action.type === 'push' ? [ ...state, action.value ] : state
    })

    const reducer = combineReducersByPath({
      'path.to.component1': childReducer,
      'path.to.component2': childReducer
    })

    let s1 = reducer(simplify(initialState), { type: 'increment' })
    t.deepEqual(desimplify(s1), res1)

    let s2 = reducer(s1, { type: 'push', value: 'a' })
    t.deepEqual(desimplify(s2), res2)

    t.end()
  })

  t.test('test 2 deep components with `path` in action ', t => {
    const initialState = {
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
    }
    let res1 = {
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
    }
    let res2 = {
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

    const reducer = combineReducersByPath({
      'path.to.component1': (state, action) => action.type === 'increment1' ? state + 1 : state,
      'path.to.component2': (state, action) => action.type === 'increment2' ? state + action.value : state
    })

    let s1 = reducer(simplify(initialState), {
      type: 'increment1',
      path: 'data.counter'
    })
    t.deepEqual(desimplify(s1), res1)

    let s2 = reducer(s1, {
      type: 'increment2',
      path: 'data.counter',
      value: 10
    })
    t.deepEqual(desimplify(s2), res2)

    t.end()
  })

  t.test('should update array element by action.path ', t => {

    const reducer1 = combineReducersByPath({
      'counter': (state, action) => action.type === 'increment' ? state + 1 : state,
      'stack': (state, action) => {
        if (action.type === 'push') return [...state, action.value]
        if (action.type === 'update') return action.value
        return state
      }
    })
    const reducer = combineReducersByPath({ c1: reducer1 })

    const initialState = { c1: { counter: 0, stack: [1, 2, 3] } }
    let s1, s2

    s1 = reducer(simplify(initialState), { type: 'increment' })
    t.deepEqual(desimplify(s1), { c1: { counter: 1, stack: [1, 2, 3] } })

    s2 = reducer(s1, { type: 'push', value: 'a' })
    t.deepEqual(desimplify(s2), { c1: { counter: 1, stack: [1, 2, 3, 'a'] } })

    s1 = reducer(s2, { type: 'update', path: '2', value: 'b' })
    t.deepEqual(desimplify(s1), { c1: { counter: 1, stack: [1, 2, 'b', 'a'] } })

    s2 = reducer(s1, { type: 'update', path: '2', value: ['c', 'b'] })
    t.deepEqual(desimplify(s2), { c1: { counter: 1, stack: [1, 2, ['c', 'b'], 'a'] } })

    t.end()
  })

})
