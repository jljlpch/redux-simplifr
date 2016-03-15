# simplifr-redux

Some auxiliary utilities that make [simplifr](https://github.com/krispo/simplifr) and [redux](https://github.com/reactjs/redux) closer. 

## API Reference

#### `combineReducers(reducers)`
Takes an object of reducer arrays, returns combined reducer function

Eg,
```js
...
import {simplify} from 'simplifr'
import {combineReducers} from 'simplifr-redux'

const initialState = {
  path: {
    to: {
      component1: {
        data: {/* JSON */}
      },
      component2: {
        data: {/* JSON */}
      }
    }
  }
}
const reducers = {
  `root.path.to.component1.data`: [reducer11, reducer12],
  `root.path.to.component2.data`: [reducer21, reducer22]      
}

const store = createStore(combineReducers(reducers), simplify(initialState))
...
```

## License
MIT