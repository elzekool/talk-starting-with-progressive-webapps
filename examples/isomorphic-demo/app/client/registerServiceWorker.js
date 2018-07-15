/**
 * Service Worker registration
 *
 * This file is responsible for registration of the ServiceWorker. When running a production
 * build the service worker is registrated on development this file tries to unregister any
 * registered service workers.
 *
 * @author Elze Kool <efrkool@live.nl>
 */

export default function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            if (process.env.NODE_ENV === 'production') {
                const swUrl = `service-worker.js`;
                registerValidSW(swUrl);
            } else {
                unregisterSW();
            }
        });
    }
}

function registerValidSW(swUrl) {
    navigator.serviceWorker.register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log('New content is available; please refresh.');
                        } else {
                            console.log('Content is cached for offline use.');
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Error during service worker registration:', error);
        });
}

function unregisterSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}
