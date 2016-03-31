# redux-simplifr

Some auxiliary utilities that make [simplifr](https://github.com/krispo/simplifr) and [redux](https://github.com/reactjs/redux) closer. 

A standard [combiteReducers](http://redux.js.org/docs/api/combineReducers.html) function from redux library gives us 
an ability to split our store into independent parts of the state, and to manage these parts with corresponding reducer functions.
```js
const initialStore = {
  todos: ...,
  counter: ...
}
// and then
combineReducers({ todos: myTodosReducer, counter: myCounterReducer })
```

But what should we do if we have multiple standalone components with their own reducer functions and actions, 
and we want to feed these components with a common data?
We want something like this
```js
const initialStore = {
  commonData: {/* massive json for all components */},
  component1: {/* data for component1*/},
  component1: {/* data for component2*/},
}
// and then
combineReducers({ 
  commonData: [component1_data_reducer, component2_data_reducer ],
  component1: component1_reducer,
  component2: component2_reducer,
})
```
With this lib we can do this. Even more, with using [simplifr](https://github.com/krispo/simplifr) we can operate with more complex data structures


For each component, we can pass the `path` information about which part of the state this component should manage.
`path` is a dot separated string that indicate a json path in our state
```js
'commonData.path.to.component1.data'
```

The `path` is used in `combineReducers` function to make a right decision of what component dispatches an action, 
what reducers should be called, and what part of the state is in use. 
```js
combineReducers({ 
  commonData.path.to.component1.data: component1_data_reducer,
  commonData.path.to.component2.data: component2_data_reducer, 
  component1: component1_reducer,
  component2: component2_reducer,
})
``` 

To dispatch a specific reducer, we should pass a `path` in action
```js
{
  type: 'COMPONENT1_DATA_ACTION',
  path: 'commonData.path.to.component1.data',
  value: 'some_value'
}
```
To dispatch all reducers we can omit the `path`
```js
{
  type: 'COMPONENT1_DATA_ACTION',
  value: 'some_value'
}
```

## API Reference

#### `combineReducers(reducers)`
Takes an object of reducer arrays, returns combined reducer function.
It works as a superset of a standard [combiteReducers](http://redux.js.org/docs/api/combineReducers.html) function from redux library.

Let's show an example how it works,
```js
...
import {simplify} from 'simplifr'
import {combineReducers} from 'redux-simplifr'

// initialize data for separated components
const initialState = {
  path: {
    to: {
      component1: {/* JSON */},
      component2: {/* JSON */}
    }
  }
}

// define reducers for component1
const reducer1 = (state = 0, action) => action.type === 'increment1' ? state + 1 : state

//define reducers for component2
const reducer2 = (state = [], action) => action.type === 'push2' ? [ ...state, action.value ] : state

// gather all reducers into a single object with componets separated by `path`
const reducers = {
  `path.to.component1.counter1`: reducer1,
  `path.to.component2.stack2`: reducer2      
}

// combine reducers via simplifr
const reducer = combineReducers(reducers)

// Now we can dispatch reducer with actions
reducer(initialState, { 
  type: 'increment1',
  path: 'path.to.component1.counter1'  
})
/* the result state:
{
  path: {
    to: {
      component1: { counter1: 1 },
      component2: {}
    }
  }
}
*/

// if we don't define exact `path` in action, all reducers will be called
reducer(initialState, { 
  type: 'increment1'
})
/* the result state:
{
  path: {
    to: {
      component1: { counter1: 1 },
      component2: { stack2: [] }      // is also called
    }
  }
}
*/
...
```

## License
MIT