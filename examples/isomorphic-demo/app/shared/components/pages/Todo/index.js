/**
 * View Todo
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {connect} from "react-redux";

import NotFound from "../NotFound";
import TemporaryNotAvailable from "../TemporaryNotAvailable";

import {fetchTodos} from "../../../state/actions/todo";


class Todo extends Component {

    componentWillMount() {
        if (
            (this.props.todo.lastFetchExpire < ((new Date()).getTime()/1000)) &&
            (
                (this.props.todo.todoList === null && !this.props.todo.isFetching) ||
                this.props.todo.hasError
            )
        ) {
            this.props.fetchTodos();
        }
    }

    render() {

        let todo = null;
        if (this.props.todo.todoList !== null) {
            this.props.todo.todoList.forEach((listItem) => {
                if (listItem.id+'' === this.props.id+'') {
                    todo = { ...listItem };
                }
            })
        }

        // If we are not fetching, having a error and todo item is not in list, return NotFound
        if (!this.props.todo.isFetching && !this.props.todo.hasError && todo === null && this.props.todo.todoList !== null) {
            return (<NotFound />);
        }

        // We cannot fetch the data from the backend
        if (this.props.todo.hasError) {
            return (<TemporaryNotAvailable reloadTrigger={this.props.fetchTodos} />);
        }

        if (this.props.todo.isFetching) {
            return (
                <div className="alert info">
                    We are loading the todo from our backend
                </div>
            )
        }

        if (this.props.todo.todoList === null) {
            return (<div></div>);
        }

        return (
            <div>
                <h2>Todo #{todo.id}</h2>
                <p>
                    Below you will find all information about this todo item
                </p>

                <div className="form-group">
                    <label htmlFor="todoText">Text</label>
                    <textarea className="form-control" id="todoText" value={todo.text} readOnly={true} />
                </div>

                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="todoDone" checked={todo.done} readOnly={true}/>
                    <label className="form-check-label" htmlFor="todoDone">Done</label>
                </div>

                <Link to="/">Back to home</Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        todo: state.todo
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTodos: () => {
            dispatch(fetchTodos())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
