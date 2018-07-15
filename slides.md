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
# Structure of the talk

* **Definition of Progressive Web App**<br/>
<small>When is your site a Progressive Web App? What advantages are there and when will you use PWA? And how can you test compatibility?</small>

* **Server workers, offline usability and push notifications**<br/>
<small>What are service workers and how do they relate to offline access and push notifications?</small>

* **Building your first app with React**<br/>
<small>Build your first Progressive Web App with React. Rendering, routing and more.</small>

* **Handling state with Redux**<br/>
<small>Organize changes in state with Redux and how to correctly implement async changes.</small>

* **Common pitfalls**<br/>
<small>Device/browser specific issues, SEO, Server side rendering</small>

---
# Progressive Web App checklist

In short **Progessive Web App is not more than a set of rules**. If you pass this checklist
you can call your app/site a Progessive Web App. It says a lot of what, very little about how.

* Site is served over HTTPS
* Pages are responsive on tablets & mobile devices
* **All app URLs load while offline**
* **Metadata provided for Add to Home screen**
* **First load fast even on 3G**
* Site works cross-browser
* **Page transitions don't feel like they block on the network**
* Each page has a URL

Most are boring, some are **exiting**.

---
# Lighthouse Audit

You can use Lighthouse inside Google Chrome to validate your site. There are multiple audit categories. One
of them is the Progressive Web App checklist:

.width-75[![Lighthouse Audit Report](images/lighthouse-audit-report.png)]

---
# Why should you care?

**Responsiveness**: Multiple items in the checklist are there to improve the user experience for your site. When
the user visits your site it is important that the user can interact with your site as soon as possible.

**Offline/limited usage**: In a realistic world you don't always have good internet. So your site users have the same.
Ever had the experience of no internet when you had to show your ticket?

**Engagement** By allowing your site to be added to the home screen and/or app drawer your visitor is more likely to
visit your site again.

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
# Service Worker lifecycle

.width-50[![Service Worker Lifecycle](images/sw-lifecycle.png)]
---
# Design strategies

* TODO: App skeleton
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