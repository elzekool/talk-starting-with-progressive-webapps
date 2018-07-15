/**
 * Home
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from "react-redux";

import TemporaryNotAvailable from "../TemporaryNotAvailable";

import reactLogo from './react-logo-text-icon.png';

import {fetchTodos} from "../../../state/actions/todo";

class Home extends Component {

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

        // We cannot fetch the data from the backend
        if (this.props.todo.hasError) {
            return (<TemporaryNotAvailable reloadTrigger={this.props.fetchTodos} />);
        }

        return (
            <div>
                <h2>This is your list of items to do:</h2>
                <p>
                    Welcome to our demonstration application! For this demonstration we made a to do list (what else?).
                    Below you will find the items that need to be done, success!
                </p>

                {this.props.todo.isFetching && (
                    <div className="alert info">
                        We are loading your todo list
                    </div>
                )}

                {this.props.todo.todoList !== null && !this.props.todo.isFetching && !this.props.todo.hasError && (
                    <ul className="list-group">
                        {this.props.todo.todoList.map((todo) => (
                            <li className={`list-group-item ${todo.done ? 'list-group-item-success' : ''}`} key={todo.id}>
                                <div className="d-flex w-100 justify-content-between">
                                    <Link to={`/todo/${todo.id}`} className={todo.done ? 'list-success' : ''}><h5 className="mb-1">Todo #{todo.id}</h5></Link>
                                    <small>{todo.done ? 'done' : 'still to do'}</small>
                                </div>
                                <p className="mb-1">
                                    {todo.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="pt-4" >
                    <img src={reactLogo} style={{ maxWidth: '50%'}} />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);