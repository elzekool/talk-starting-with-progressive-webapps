/**
 * 404 / Not Found page
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React from 'react';
import {Link, withRouter} from 'react-router-dom';

const NotFound = ({ staticContext }) => {

    // Make sure we are returning a 404 response on NotFound
    if (staticContext !== void 0) {
        staticContext.resultCode = 404;
    }

    return (
        <div>
            <h2>Whooops <small className="text-muted">404 Not Found</small></h2>
            <p>
                The page you are looking for is not found or just plain gone.. sorry for that ;-)
            </p>
            <p>
                I can recommend you to go <Link to="/">back to home</Link>.
            </p>
        </div>
    )
};

export default withRouter(NotFound);