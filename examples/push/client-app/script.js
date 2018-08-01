/**
 * Main script
 *
 * @author Elze Kool <efrkool@live.nl>
 */

(function() {
    window.addEventListener('DOMContentLoaded', function() {

        var pubKeyField = document.getElementById('vapid-pkey');
        var button = document.getElementById('push-request');
        var jsonField = document.getElementById('subscription-json');

        if (!('serviceWorker' in navigator)) {
            alert("No service worker support");
            return;
        }

        if (!('PushManager' in window)) {
            alert("No PushManager support");
            return;
        }

        // Register service worker
        navigator.serviceWorker.register('service-worker.js');

        // The old API function directly returned a result. The new standard is to return a promise.
        // but there is no way to test for it. So this creates a wrapper that in both cases will return
        // a promise
        function askPermission() {
            return new Promise(
                function(resolve, reject) {
                    var permissionResult = Notification.requestPermission(function(result) {
                        resolve(result)
                    });

                    if (permissionResult) {
                        permissionResult.then(resolve, reject)
                    }
                })
                .then(function(permissionResult) {
                    if (permissionResult !== 'granted') {
                        throw new Error('Permission denied')
                    }
                });
        }

        // This function converts to URL safe base64 encoded version of the vapid key to a
        // byte array
        function urlBase64ToUint8Array(base64String) {
            var padding = '='.repeat((4 - base64String.length % 4) % 4);
            var base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/')
            ;
            var rawData = window.atob(base64);
            return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
        }

        // Button handler
        button.addEventListener('click', function() {

            // Wait for service worker to become ready
            navigator.serviceWorker.ready.then(function(registration) {

                // Ask permission
                askPermission().then(function() {
                    var options = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(pubKeyField.value)
                    };

                    registration.pushManager.subscribe(options)
                        .then(function(pushSubscription) {
                            jsonField.value = JSON.stringify(pushSubscription);
                        });

                });

            }, function(err) {
                alert('Service Worker registration failed: ' + err);
            });
        });

    });
})();