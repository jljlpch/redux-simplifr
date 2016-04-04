# redux-simplifr

Combining reducer utilities that make [simplifr](https://github.com/krispo/simplifr) and [redux](https://github.com/reactjs/redux) closer. 

## API Reference

#### `combineReducersByPath(reducers)`
Takes an object of reducers, returns combined reducer function.

Let's show an example how it works,
```js
...
import {simplify} from 'simplifr'
import {combineReducersByPath} from 'redux-simplifr'

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
  `root.path.to.component1.counter1`: reducer1,
  `root.path.to.component2.stack2`: reducer2      
}

// combine reducers via simplifr
const reducer = combineReducersByPath(reducers)

// Now we can dispatch reducer with actions
reducer(simplify(initialState), { 
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
reducer(simplify(initialState), { 
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