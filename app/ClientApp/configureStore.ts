import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as StoreModule from './store';
import { ApplicationState, reducers } from './store';
import { History } from 'history';

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    const windowIfDefined = typeof window === 'undefined' ? null : window as any;
    // If devTools is installed, connect to it
    const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;

    // build middleware. add redux-logger only on development mode
    var middlewares = [thunk, routerMiddleware(history)]
    if (module.hot) {
        middlewares.push(logger)
    }
    const createStoreWithMiddleware = compose(
        applyMiddleware(...middlewares),
        devToolsExtension ? devToolsExtension() : f => f
    )(createStore);
    
    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./store', () => {
            const nextRootReducer = require<typeof StoreModule>('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }

    return store;
}

function buildRootReducer(allReducers) {
    return combineReducers<ApplicationState>(Object.assign({}, allReducers, { routing: routerReducer }));
}
