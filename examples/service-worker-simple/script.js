/**
 * Main script
 *
 * @author Elze Kool <efrkool@live.nl>
 */

(function() {
    window.addEventListener('DOMContentLoaded', function() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js');
        }
    });
})();