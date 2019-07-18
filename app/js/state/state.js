
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'

import { AppReducer } from './reducer'
import { AppEpic } from './epic'

const initialState = {
  navigation: true,
}

const epicMiddleware = createEpicMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const AppState = createStore(
  AppReducer,
  composeEnhancers(
    applyMiddleware(epicMiddleware)
  )
)

epicMiddleware.run(AppEpic)

export { AppState }



// import reducerRegistry from './reducerRegistry'

// const combine = (reducers) => {
//   const reducerNames = Object.keys(reducers);
//   Object.keys(initialState).forEach(item => {
//     if (reducerNames.indexOf(item) === -1) {
//       reducers[item] = (state = null) => state;
//     }
//   });
//   return combineReducers(reducers);
// };

// const reducer = combine(reducerRegistry.getReducers())


// reducerRegistry.setChangeListener(reducers => {
//   AppState.replaceReducer(combine(reducers));
// });

// data/createStore.js
//
// import { combineReducers, createStore } from 'redux';
// import reducerRegistry from './reducerRegistry';
//
// const initialState = /* from local storage or server */
//
// // Preserve initial state for not-yet-loaded reducers
// const combine = (reducers) => {
//   const reducerNames = Object.keys(reducers);
//   Object.keys(initialState).forEach(item => {
//     if (reducerNames.indexOf(item) === -1) {
//       reducers[item] = (state = null) => state;
//     }
//   });
//   return combineReducers(reducers);
// };
//
// const reducer = combine(reducerRegistry.getReducers());
// const store = createStore(reducer, initialState);
//
// // Replace the store's reducer whenever a new reducer is registered.
// reducerRegistry.setChangeListener(reducers => {
//   store.replaceReducer(combine(reducers));
// });
//
// export default store;
