/**
 * Client Entry Point
 *
 * This is the client entry point. This entry point is quite the same as a regular
 * React entrypoint. The only difference is that it checks if there is already a
 * server-side rendered version and if so, hydrate it.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React from 'react';
import {render,hydrate} from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux';

import storeFactory from '../shared/state/storeFactory';
import App from '../shared/components/layout/App/index';

const root = document.getElementById('root');
const toRender = (
    <Router>
        <Provider store={storeFactory()}>
            <App />
        </Provider>
    </Router>
);

// Check if there are elements under the root, when
// using the WebPack devServer there is no SSI and so there
// is no actual child, we need to render
if (root.firstElementChild === null) {
    render(toRender, root);

// When we have a result from our ExpressJS backend the content
// of the element is already present, we use hydrate here. This will
// cause React only to attach required handles.
} else {
    hydrate(toRender, root);
}

registerServiceWorker();