/**
 * Factory for Redux Store
 *
 * The store initialization is dependent on the environment. On the client
 * environment the store is initialized and an event is dispatched to allow the
 * client to initialize the state from the backend state.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import todoReducer from "./reducers/todoReducer";

export const INITIALIZE_FROM_STATE = 'INITIALIZE_FROM_STATE';

export default () => {
    const rootReducer = combineReducers({
        todo: todoReducer
    });

    // Check if we are initializing the store for the frontend client
    if (typeof window !== 'undefined') {
        const store = createStore(
            rootReducer,
            applyMiddleware(...[

                // Thunk allows dispatching non-pure functions
                thunk,

                // If not production, add a logger
                (process.env.NODE_ENV === 'production')
                    ? null
                    : logger

            ].filter(middleware => (middleware !== null)))
        );

        if (typeof window.__INITIAL_STATE__ !== 'undefined') {
            store.dispatch({
                type: INITIALIZE_FROM_STATE,
                state: window.__INITIAL_STATE__
            });
        }

        return store;

    // Or for the server environment
    } else {
        return createStore(
            rootReducer,
            applyMiddleware(...[

                // Thunk allows dispatching non-pure functions
                thunk,

                // If not production, add a very limited logger to show which redux actions
                // are processed.
                (process.env.NODE_ENV === 'production')
                    ? null
                    : () => { return next => action => {
                        console.log(`Redux action: ${action.type}`);
                        next(action);
                    }}

            ].filter(middleware => (middleware !== null)))
        );
    }
}