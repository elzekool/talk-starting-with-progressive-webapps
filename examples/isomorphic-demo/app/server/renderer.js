/**
 * Server Renderer
 *
 * This is the React Serverside Renderer. It uses React.renderToString to render the React app.
 * To correctly handle Promise resolution within the app the async promise queue is used.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import {Provider} from 'react-redux';

import storeFactory from '../shared/state/storeFactory';
import App from "../shared/components/layout/App";

import template from "../../build/index.html";
import {clearPromiseQueue, getPromiseQueue} from "../shared/state/async";

export default function renderer(req, res) {

    const reactInject = '<div id=\'root\'>';
    const stateInject = '<body>';
    const store = storeFactory();

    // Renderer for React, functional mostly the same as web based
    // rendering. Only uses renderToString instead of render() and
    // uses StaticRouter instead of BrowserRouter
    const renderReactHtml = () => {
        let context = {};
        const html = renderToString(
            <StaticRouter context={context} location={req.url}>
                <Provider store={store}>
                    <App/>
                </Provider>
            </StaticRouter>
        );
        return { context: context, html: html };
    };

    // Send Response back to Client, takes state to inject, context to determine
    // kind of response to send and the actual rendered React app HTML
    const sendResponse = (state, context, html) => {
        const stateHtml = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(state)};</script>`;
        if (context.url) {
            res.writeHead(302, { location: context.url});
            res.end()
        } else {
            res
                .status(context.resultCode || 200)
                .send(
                    template
                        .replace(reactInject, reactInject + html)
                        .replace(stateInject, stateInject + stateHtml)
                );
        }
    };

    // Promise resolution functionality. Basically the React app is rendered. After the render
    // is complete the Promise queue is checked. If it is empty it will send the response. If
    // not empty a recursive promise is used to wait for all promises to be resolved. This means
    // that we re-render the whole React app again. There is currently not a way around this.
    let promiseWaitRecursion = 0;
    const recursivePromiseWait = () => {
        const { context, html } = renderReactHtml();
        const queue = getPromiseQueue();

        if (queue.length === 0) {
            sendResponse(store.getState(), context, html);
            return;
        }

        // If a Promise triggers adding a new promise a new recursion is done. If due to a coding error
        // this happens more then 5 times we stop waiting for the promise to be resolved.
        if (promiseWaitRecursion > 5) {
            console.error('Promise wait recursion is larger then 5, most probably a promise in an endless loop');
            sendResponse(store.getState(), context, html);
            return;
        }

        promiseWaitRecursion++;
        console.debug('Waiting for promises to be resolved...');

        clearPromiseQueue();
        Promise.all(queue).then(() => {
            recursivePromiseWait();
        }).catch((error) => {
            if (error instanceof Error) {
                res.status(500).contentType('text/plain').send(error.stack || error.message);
            } else {
                res.status(500).contentType('text/plain').send("A server error has occurred");
            }
        });
    };

    // Trigger rendering and promise resolution
    recursivePromiseWait();
}