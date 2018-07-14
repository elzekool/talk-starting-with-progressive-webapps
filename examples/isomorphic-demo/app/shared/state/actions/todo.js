/**
 * Todo actions
 *
 * Actions that will trigger updates to the state of todo's
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import axios from "axios";
import {markPromiseForWait} from "../async";

export const TODO_START_FETCH = 'TODO_START_FETCH';
export const TODO_FETCH_COMPLETE = 'TODO_FETCH_COMPLETE';
export const TODO_FETCH_FAILURE = 'TODO_FETCH_FAILURE';

export const fetchTodos = () => {
    return (dispatch) => {
        dispatch({ type: TODO_START_FETCH });

        const xhr = axios.get('http://localhost:5000/todos');
        markPromiseForWait(xhr);

        xhr
            .then((result) => {
                dispatch({ type: TODO_FETCH_COMPLETE, payload: { data : result.data } });
            })
            .catch((result) => {
                dispatch({ type: TODO_FETCH_FAILURE, payload: { message : 'Error fetching todo\'s' } });
            })
    }
};