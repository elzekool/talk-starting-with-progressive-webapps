/**
 * Redux Reducer for Todo's
 *
 * The reducer is responsible for updating the state given the contents of the previous state and
 * the action that needs to be processed.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import {TODO_FETCH_COMPLETE, TODO_FETCH_FAILURE, TODO_START_FETCH} from "../actions/todo";
import {INITIALIZE_FROM_STATE} from "../storeFactory";

const initialState = {
    isFetching: false,
    hasError: false,
    errorMessage: null,
    todoList: null,
    lastFetchExpire : 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case INITIALIZE_FROM_STATE:
            state = {
                ...state,
                ...action.state.todo
            };
            break;

        case TODO_START_FETCH:
            state = {
                ...state,
                isFetching: true,
                hasError: false,
                errorMessage: null
            };
            break;

        case TODO_FETCH_COMPLETE:
            state = {
                ...state,
                isFetching: false,
                hasError: false,
                errorMessage: null,
                todoList: action.payload.data,
                lastFetchExpire: ((new Date()).getTime()/1000) + (60)
            };
            break;

        case TODO_FETCH_FAILURE:
            state = {
                ...state,
                isFetching: false,
                hasError: true,
                errorMessage: action.payload.message,
                lastFetchExpire: ((new Date()).getTime()/1000) + (5)
            };
            break;

        default : {
            state = {
                ...state
            };
        }
    }

    return state;
};