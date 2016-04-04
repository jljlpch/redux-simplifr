'use strict'
let test = require('tape')

import { combineReducersByPath } from '../lib'
import { simplify, desimplify} from 'simplifr'

test('combineReducersByPath tests', t => {

  t.test('test 2 deep components with counter ', t => {
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
      'root.path.to.component1': (state, action) => action.type === 'increment1' ? state + 1 : state,
      'root.path.to.component2': (state, action) => action.type === 'increment2' ? state + action.value : state
    })

    let s1 = reducer(simplify(initialState), {
      type: 'increment1',
      path: 'root.path.to.component1.data.counter'
    })
    t.deepEqual(desimplify(s1), res1)

    let s2 = reducer(s1, {
      type: 'increment2',
      path: 'root.path.to.component2.data.counter',
      value: 10
    })
    t.deepEqual(desimplify(s2), res2)

    t.end()
  })

  t.test('test 2 components without path in action ', t => {

    const reducer = combineReducersByPath({
      'root.c1': (state, action) => {
        state.counter = state.counter || 0
        state.stack = state.stack || []

        switch (action.type) {
          case 'increment1': return Object.assign({}, state, { counter: state.counter + 1})
          case 'push1': return Object.assign({}, state, { stack: [...state.stack, action.value] })
          default: return state
        }
      },
      'root.c2': (state, action) => {
        state.counter = state.counter || 0
        state.stack = state.stack || []

        switch (action.type) {
          case 'increment2': return Object.assign({}, state, { counter: state.counter + action.value})
          case 'push2': return Object.assign({}, state, { stack: [...state.stack, action.value] })
          default: return state
        }
      }
    })

    const initialState = { c1: {}, c2: {} }
    let s1, s2

    s1 = reducer(simplify(initialState), { type: 'increment1' })
    t.deepEqual(desimplify(s1), { c1: { counter: 1, stack: [] }, c2: {} })

    s2 = reducer(s1, { type: 'push1', value: 'a' })
    t.deepEqual(desimplify(s2), { c1: { counter: 1, stack: ['a'] }, c2: {} })

    s1 = reducer(s2, { type: 'increment2', value: 10 })
    t.deepEqual(desimplify(s1), { c1: { counter: 1, stack: ['a'] }, c2: { counter: 10, stack: [] } })

    s1 = reducer(s2, { type: 'increment2', value: 10 })
    t.deepEqual(desimplify(s1), { c1: { counter: 1, stack: ['a'] }, c2: { counter: 10, stack: [] } })

    t.end()
  })

})
