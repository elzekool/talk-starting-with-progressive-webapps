# Examples

In this folder you can find a list of examples that are related to the talk.
Here is an overview:

## Promisses
Example how to use a Promise.

Source: [/examples/promisses](/examples/promisses)

## Webworkers
Example how to create a WebWorker and communicate with it trough messages. 

Source: [/examples/webworker](/examples/webworker)

## Service Workers
Example how to create a Service Worker, register it and how to listen to lifecycle events.

Source: [/examples/service-worker-simple](/examples/service-worker-simple)

## Push Notifications
For Push Notification there are 3 examples that work together.

#### VAPID Keygen
Example that shows how to create VAPID keys using the `web-push` library.

Source: [/examples/push/vapid-keygen](/examples/push/vapid-keygen)

#### Client Application
Example that shows how to ask permission for showing notifications, register a Push subscription and 
display received Push messages using a Service Worker.

Source: [/examples/push/client-app](/examples/push/client-app)

#### Send Push Utility
Example that shows how a service can create a Push Notification from the data received when registering with 
a Push service.

Source: [/examples/push/send-push](/examples/push/send-push) 

#### Isomorphic Example
Example of an Isomorphic (hybrid server side and client side rendering) React Progressive Web App. 
This example needs the demo backend that can be found at [/examples/demo-backend](/examples/demo-backend).

Source: [/examples/isomorphic-demo](/examples/isomorphic-demo)
