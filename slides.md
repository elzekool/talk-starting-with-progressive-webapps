class: center, middle, titlescreen

# Starting with Progressive Web Apps (PWA)
## A talk by [@elzekool](https://github.com/elzekool)

---
# Introduction

### About me
* I'm a Magento developer at Youwe, from our office in Groningen
* Mainly a backend developer but trying to be cool and be full-stack

### About this talk
* For everyone that wants to what Progressive Web App stands for
* It is for developers that want to start creating Progressive Web Apps
* Has code samples to make everything clear

---
# Before we begin

### Slides

* I use a lot of text in my slides. I do this so that you can later read back the important things I mentioned

### Code examples
* I have made some examples, some I will discuss during the talk, you can find all of them in the `examples`folder.
* I use ES6 in my code samples. Most important to remember: `const` and `let` are the same as `var`. Only `const` 
doesn't allow assigning a new value. Also `(a,b) => a*b` and `(a,b) => { return a*b; }` is the same as `function(a,b) { return a*b; }` 

---
# Structure of the talk

#### **Definition of Progressive Web App**
<small>When is your site a Progressive Web App? What advantages are there and when will you use PWA? And how can you test compatibility?</small>

#### **Server workers, offline usability and push notifications**
<small>What are service workers and how do they relate to offline access and push notifications?</small>

#### **Building your first app with React**
<small>Build your first Progressive Web App with React. Rendering, routing and more.</small>

#### **Handling state with Redux**
<small>Organize changes in state with Redux and how to correctly implement async changes.</small>

#### **Common pitfalls**
<small>Device/browser specific issues, SEO, Server side rendering</small>

---
# Progressive Web App, intro

Independent designer `Frances Berriman` and Google engineer `Alex Russell` invented the therm in `2015`. 
The term describes sites/app that take advantage of modern web techniques. So in short it is not a specific technique
but a set of characteristics that define the progessive web app. 

Frances Berriman & Alex Russell:

.width-25[![Frances Berriman](images/frances-berriman.jpeg)] .width-25[![Alex Russell](images/alex-russell.jpeg)]  

---
# Progressive Web App

Characteristics of a Progressive Web App are:
    
* Work on **every browser** and on **every device**. Use progessive enhancements.
* Work **offline** or on low quality networks
* **Feel like an app** to the user with app-style interactions and navigation.
* Uses **HTTPS** to prevent snooping and ensure content hasn’t been tampered with.
* Are **discoverable** by providing a W3C manifest.
* Make re-engagement easy through features like **push notifications** and **installation on their homescreen**.
* Can be **linked** to, and don't require installation.

---
# Progressive Web App checklist

From the characteristics a set of rules where created. The most important are: 

* Site is served over HTTPS
* Pages are responsive on tablets & mobile devices
* **All app URLs load while offline**
* **Metadata provided for Add to Home screen**
* **First load fast even on 3G**
* Site works cross-browser
* **Page transitions don't feel like they block on the network**
* **Each page has a URL**

I will focus on the **highlighted** items in this talk


---
# Lighthouse Audit

You can use Lighthouse inside Google Chrome to validate your site. There are multiple audit categories. One
of them is the Progressive Web App checklist:

.width-75[![Lighthouse Audit Report](images/lighthouse-audit-report.png)]

---
# Why should you care?

#### **Responsiveness**
Multiple items in the checklist are there to improve the user experience for your site. When
the user visits your site it is important that the user can interact with your site as soon as possible.

#### **Offline/limited usage**
In a realistic world you don't always have good internet. So your site users have the same.
Ever had the experience of no internet when you had to show your ticket?

#### **Engagement**
By allowing your site to be added to the home screen and/or app drawer your visitor is more likely to
visit your site again.


---
# Out of scope for this talk

#### **Serving pages trough HTTPS**
Ask your hosting provider for more assistance. If you host yourself, you can try
using Let's Encrypt, it has a tool to auto create/add certificates for free. Caddy is a server that includes Let's Encrypt
out of the box. A lot of techniques used in this talk work only on HTTPS (and localhost).

#### **Pages are responsive on tablets & mobile devices**
Use a correct `viewport` and implement media queries. A good starting point is using a CSS framework
like `Bootstrap`, `Foundation`, `UIKit` (and many others...)

#### **Site works cross-browser**
Test your site in different browsers. Use sites like `Browerstack` or `Saucelabs` to test in browsers
you don't have installed locally. You can use [http://browserl.ist/?defaults](http://browserl.ist/?defaults) to see a list of modern
browsers you should support.

---
# Promisses (1/2)

Promisses are an integral part of modern languages and are used in all new implemented features. Therefor it's important to
understand them.

Example promise creation:
```javascript
new Promise((resolve, reject) => {
    try {
        // Do some time consuming stuff
        resolve({ message : 'Hello world' });
    } catch (e) {
        reject(e);
    }
});
```
And usage:
```javascript
fetch('http://www.example.com/things')
    .then((result) => { console.log('Result'); })
    .catch((reason) => { console.log('Houston, we have a failure!'); });
```

---
# Promisses (2/2)

You can also chain promises. The functions `Promise.then()`, `Promise.catch()` return a new Promise. The resolution of
that Promise is based on the return value of the handler, an example:
```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => { resolve('I am resolved!'); }, 200);
});

promise
*   .then((result) => `I received: ${result}`)
    .then((result) => { console.log(result); })
    .catch((reason) => { console.log(reason.message); });
```

There is also `Promise.finally()` (analog to finally in try..catch), `Promise.resolve()` to create a resolved Promise and
`Promise.race()` / `Promise.all()` to wait for the first/all promises to resolve/reject.

---
# Web Worker (1/2)

Web Workers are scripts that are run in the background, detached from the UI or DOM. They are meant to allow scripts
to do long tasks without blocking, basically running multi-threaded.

Registration:
```javascript
const myWorker = new Worker('worker.js');
```

Due to the fact web workers run in a different thread you cannot access data directly you need the send/receive messages
with data. They also don't have access to the DOM.

Sending and receiving messages to/from the Web Worker (from UI):
```javascript
myWorker.postMessage([ 2, 5 ]);

myWorker.onmessage = (e) => {
  console.log('Message received from worker:', e.data);
}
```

---
# Web Worker (1/2)


Sending and receiving messages to/from the UI (from Web Worker):
```javascript
onmessage = (e) => {
  console.log('Message received from main script');
  const workerResult = `Result: ${(e.data[0] * e.data[1])}`;
  console.log('Posting message back to main script');
  postMessage(workerResult);
}
```

You can use `onmessage` in the Web Worker as this is defined in the global scope. Just like with the `window` object
in regular scripts. The global scope is also available as `self`.

.width-65[![Debugging Web Workers](images/webworker-debug.png)]


---
# Service Worker

A Service Worker is a special kind of **Web Worker** that in the background has two tasks:

* Network proxy (this is what allows offline usage). Better then AppCache as it is completely controlled by you.
* Entry point for push notifications

The Service Work spec is still in draft. If you have trouble sleeping, you can the last draft on https://w3c.github.io/ServiceWorker/.
But the standard is mature enough to start working with it. With Safari now also joining the team it is supported in all
major platforms

.width-65[![Service Worker Support Chart](images/service-worker-ready.png)]


---
# CacheStorage API

The CacheStorage API is specifically meant for caching web assets. It's exposed in the `caches` object in the
global scope. `CacheStorage`allows creating multiple `Cache` instances. Each `Cache` can hold multiple items which are identified by their URL.
All functions return a `Promise`. 

Most important `CacheStorage` functions are:
* `CacheStorage.open(key)` creates/opens a `Cache` with given key. `CacheStorage.match(url)` looks in all `Cache` 
objects that match given URL. (Also available: `CacheStorage.keys()` and `CacheStorage.delete()`)

Most important `Cache` functions are:
* `Cache.add(url)/Cache.addAll([urls])` Takes an (array of) URLs, fetches and caches them. If you need the response you
need to fetch them yourself and use `Cache.put(url/request, response)` to save it to the cache. 
(Also available: `Cache.match(url)`, `Cache.delete(url/request)`, `Cache.keys()`)   
   

---
# Service Worker lifecycle

Registration of a service worker is just like creating a Web Worker:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

.width-45-r[![Service Worker Lifecycle](images/sw-lifecycle.png)]

On initial registration the first event is `installing`. This allows the Service Worker to do some initialization.

After initialization and next page load the service worker is `activated`. 

This means it receives `fetch` events on network requests in `scope`. 

---
# Service Worker initialization

This is very simple example of a Service Worker script. I uses the `On install` approach (for example to install the
`App Shell`) 

``` javascript
const preCacheList = [ 'index.html', 'script.js', 'bootstrap.min.css' ];
const cacheIdentifier = 'awesome-app-v1';

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(cacheIdentifier).then(cache => cache.addAll(preCacheList))
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated!');
});

self.addEventListener('fetch', => (event) => {
    var url = new URL(event.request.url);
    if (
        url.origin === location.origin && 
        preCacheList.indexOf(url.pathname) !== -1
    ) {
        event.respondWith(caches.match(url.pathname));
    }
});
```

---
# Service Worker usage

You are completely free in your choice how and what you cache. Shown was `on install`. But other common options are
`cache with network fallback`, `network with cache fallback` and `cache with background fetch`. 

You can control the cache from both the UI and from the Service Worker so you can tailor you caching strategies to
your needs. Also a common used technique are fallback images when offline. 

* TODO: Improve!

---
# Push Notifications, intro

Push notifications are the notifications you get when something important happens. They can be annoying but when used
correctly they can greatly improve the engagement of the user with your site/app.

The `Push API` was created to consolidate all the different previous implementations. It is supported by all major browsers except Safari/iOS. This
means in the Netherlands the reach is about 60% and worldwide about 75%. The Apple API is outside the scope of this talk as it
not part of the PWA specs.

.width-100[![Can I use Push API](images/can-i-use-push-api.png)]

---
# Push Notifications, workflow

Below a typical flow of functions/events is shown for the Push Notification functionality:

.width-100[![Push API flow](images/push-flow.png)]

---
# Request permission, subscribe

A typical subscription flow would be: 

``` javascript

// Wait for service worker to be ready
navigator.serviceWorker.ready.then((registration) => {

    // Request permission to show notification
    Notification.requestPermission()
        .then((result) => {
            if (result !== 'granted') {
                throw Error('No permission')
            }
            
            const options = {
                userVisibleOnly: true,
                applicationServerKey: VAPID_PUB_KEY
            };
            
            // Register with Push service
            registration.pushManager.subscribe(options).then((subscription) => {
                // Send JSON.stringify(subscription) to backend application
            });
        });
    });
});
```

---
# VAPID

In the example on the previous page a value called `VAPID_PUB_KEY` could be seen. `VAPID` stands for 
"Voluntary Application Server Identification". 

In the call to the push service a header is added. This header contains a securely hashed JSON object with
the target audience (the endpoint of the notification service) and a subject (sender) identification. An example JSON 
document could be:

``` json
{
  "aud": "https://push.services.mozilla.com",
  "exp": 1458679343,
  "sub": "mailto:example@example.com"
}
```   
The hash is done using a asymmetric (different public and private) key pair. By providing the public key in the subscription
request only servers that can sign the message with the private key are allowed to push notifications.

In the `examples/push/vapid-keygen` folder a script can be found to create a key pair. 

---
# Send Push message

Push messages are send to the push service using the "Web Push Protocol". This is a standardized protocol. This means
a lot of packages are available, including:

* **NodeJS:** https://www.npmjs.com/package/web-push
* **PHP:** https://packagist.org/packages/minishlink/web-push
* **Python:** https://pypi.org/project/pywebpush/

NodeJS example:

``` javascript
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:example@example.com',
    publicKey,
    privateKey
);

const result await webpush.sendNotification(
    JSON.parse(subscriptionJson), 
    'This is my great push message'
);
```



---
# Design strategies

* TODO: App shell
* TODO: Expired, Stale data
* TODO: Local storage methods: LocalStorage, SessionStorage, IndexedDB -> Permanent


---
# Common pitfalls

The world is not always a happy place. Things go wrong, this are some things that can bite you:

* Caching of Service Worker

* You can have multiple versions of your site running

* The browser that is used when your site/app is used from the home screen/app drawer is not the same as the normal browser

* Search engines cannot always render the frontend correctly using javascript

---
# Issue: Caching of Service Worker

* TODO: No cache buster possible (always same URL)
* TODO: ETag, Cache-Control
* TODO: Varnish

---
# Issue: Old client version

In the traditional pattern you serve a pre-cached version to the user from the service worker. In the background you
check if there is a new version. When there is a new version you pre-cache it and show a message to the user to refresh
the page.

**Issue**: Your site may call APIs that cannot handle the old client anymore. Or content in your site is aged

**Possible solution**: Give an expiration to your cached data, after this date your data is considered to old and
you force a refresh.

.width-40[![Hunebed](images/hunebed.jpg)]

---
# Issue: Schizophrenic browsers

When you let your customer install your site to the home screen.. the browser gets schizophrenic. Reason: The "normal"
browser is just that a normal browser. The browser instance that is used when opening as an app. In that case it is an
instance of the same component that is used in native apps when the want to use a browser. Due to security and backwards
compatibility there are differences.

Most annoying is iOS/Safari. There all storage is split between the regular browser and app browsers. In old versions of
iOS there was a delay in sync between the two storage's causing weird behaviour, in the last versions of iOS the storages are
completely isolated.

**Possible solution**: None really.. :( For iOS give a warning to users that the need to login again. Also don't switch domains (for login for example)
this may cause Safari to switch your app to the regular browser with that storage.

---
# Issue: Javascript rendering + SEO

* TODO: Mixed results between search engines
* TODO: If used, don't do async calls
* TODO: No headers (no way to say 404, 403, etc..)
* TODO: Solution isomorphic app