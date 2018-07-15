/**
 * App Container
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from "../Header/index";

import Home from "../../pages/Home/index";
import Todo from "../../pages/Todo/index";
import NotFound from "../../pages/NotFound/index";

// noinspection ES6UnusedImports
import bootstrap from "./bootstrap.min.css";

const App = () => {
    return (
        <div>
            <Header/>
            <div className="container pt-4 pb-4">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/todo/:id" render={({match}) => { return (<Todo id={match.params.id}/> )}} />
                    <Route path='*' exact={true} component={NotFound} />
                </Switch>
            </div>
        </div>
    )
};

export default App;