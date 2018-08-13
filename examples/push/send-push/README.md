# Send Push Utility
Example that shows how a service can create a Push Notification from the data received when registering with 
a Push service.

## How to use
1. Navigate to the folder `/examples/push/send-push`
2. Run `yarn install` this will all dependencies
3. Make sure you created a key with [VAPID Keygen](/examples/push/vapid-keygen)
4. Get a subscription using the [Client Application](/examples/push/client-app)
5. Run `node push.js`
6. Enter your private and public key generated in step 3. when requested
7. Enter your subscription string generated in step 4. when requested
8. A push message is send.
