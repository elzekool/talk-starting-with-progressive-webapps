/**
 * Async Wait Queue
 *
 * In our APP we use promises to fetch data from external systems. To prevent blocking the UI/APP we
 * use promises in this case. Unfortunately React.renderToString cannot handle Promises. This means that
 * if we use triggers on the server the response is already send to the server before the promise can be
 * resolved/rejected.
 *
 * This module allows keeping a queue of promises that need to be resolved before a response is send.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

let promiseQueue = [];

/**
 * Mark that we should wait for given promise
 *
 * @param {Promise} promise
 */
export const markPromiseForWait = (promise) => {

    // We are only interested when we are running on the server
    if (typeof window !== 'undefined') {
        return;
    }

    // Encapsulate original promise in a new promise, this
    // way we are not bothered with the fact some promises may fail
    promiseQueue.push(new Promise((resolve, reject) => {
        promise.then(resolve,resolve);
    }));
};

/**
 * Get queue of promises
 *
 * @returns {Array}
 */
export const getPromiseQueue = () => {
    return promiseQueue;
};

/**
 * Clear promise queue
 */
export const clearPromiseQueue = () => {
    promiseQueue = [];
};