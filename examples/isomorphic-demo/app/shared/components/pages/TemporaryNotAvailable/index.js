/**
 * 503 / Temporary unavailable
 *
 * @author Elze Kool <efrkool@live.nl>
 */

import React from 'react';
import {withRouter} from 'react-router-dom';

const TemporaryNotAvailable = ({ staticContext, reloadTrigger }) => {

    // Make sure we are returning a 503 response
    if (staticContext !== void 0) {
        staticContext.resultCode = 503;
    }

    return (
        <div>
            <h2>Whooops <small className="text-muted">503 Service Unavailable</small></h2>
            <p>
                We are experiencing a temporary error in loading the data from our backend. We hope
                this is a temporary error.
            </p>

            {reloadTrigger !== void 0 && (
                <div>
                    <button onClick={reloadTrigger} className="btn btn-sm">Try reloading the data</button>
                </div>
            )}
        </div>
    )
};

export default withRouter(TemporaryNotAvailable);