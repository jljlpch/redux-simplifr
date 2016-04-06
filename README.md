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

// initialize nested data for separated components
const initialState = {
  path: {
    to: {
      component1: {
        counter: 0,
        stack: []
      },
      component2: {        
        data: {
          array: [1, 2, 3]
        }
      }
    }
  }
}

// define reducers for component1
const reducer1 = combineReducersByPath({
  counter: (state = 0, action) => action.type === 'increment' ? state + 1 : state,
  stack: (state = [], action) => action.type === 'push' ? [ ...state, action.value ] : state  
}) 

// define reducers for component2
const reducer2 = combineReducersByPath({
  'data.array': (state, action) => action.type === 'update' ? action.value : state  
}) 

// combine reducers for different components
const reducer = combineReducersByPath({
  `root.path.to.component1`: reducer1,
  `root.path.to.component2`: reducer2      
})

// Now we can call reducer with actions

let s = reducer(simplify(initialState), { type: 'increment1' })
/* the result state we can find using `desimplify(s)` command: 
{
  path: {
    to: {
      component1: { counter: 1, stack: [] },
      component2: { data: { array: [1, 2, 3] } }
    }
  }
}
*/

// push some value to component1 stack 
s = reducer(s, { type: 'push', value: 'a' })
/* the result state we can find using `desimplify(s)` command: 
{
  path: {
    to: {
      component1: { counter: 1, stack: ['a'] },
      component2: { data: { array: [1, 2, 3] } }
    }
  }
}
*/

// change an element in component2 data array by passing the index in `action.path`
// notice that the all path has already defined in `combineReducersByPath` function,
// we only extend this path with array index 
s = reducer(s, { type: 'update', path: '2', value: 'a' })
/* the result state we can find using `desimplify(s)` command: 
{
  path: {
    to: {
      component1: { counter: 1, stack: ['a'] },
      component2: { data: { array: [1, 2, 'a'] } }
    }
  }
}
*/

// also we can update the element with any value such as any JSON object
s = reducer(s, { type: 'update', path: '1', value: { foo: 'bar'} })
/* the result state we can find using `desimplify(s)` command: 
{
  path: {
    to: {
      component1: { counter: 1, stack: ['a'] },
      component2: { data: { array: [1, { foo: 'bar'}, 'a'] } }
    }
  }
}
*/
...
```

## License
MIT