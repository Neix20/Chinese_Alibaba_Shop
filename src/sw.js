/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const cacheName = 'cache-v1';

const image_name = [
  'images/3th anni.png',
  'images/b5.jpg',
  'images/bg.jpg',
  'images/bg2.jpg',
  'images/blueberry.jpg',
  'images/facebook.png',
  'images/granitead.jpg',
  'images/insta.png',
  'images/logo.png',
  'images/papaya-juice.png',
  'images/pineapple-juice.jpg',
  'images/raspberry.jpg',
  'images/search.png',
  'images/strawberry-juice.jpg',
  'images/twitter.png',
  'images/watermelon-juice.jpg',
  'images/xmark.png',
  'images/checkmark.png',
  'images/rice_field.jpg'
]

const html_name = [
    'index.html',
    'new_product.html',
    'promotion.html'
]

const js_name = [
    'js/bootstrap.bundle.js',
    'js/jquery-3.5.1.min.js'
]

const css_name = [
    'css/flip.css',
    'css/nav_bar.css',
    'css/bootstrap.css'
]

var precacheResources = ['/'];

precacheResources = precacheResources.concat(image_name);
precacheResources = precacheResources.concat(html_name);
precacheResources = precacheResources.concat(js_name);
precacheResources = precacheResources.concat(css_name);

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});

// TODO 2.6 - Handle the notificationclose event
self.addEventListener('notificationclose', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
  
    console.log('Closed notification: ' + primaryKey);
  });
  

// TODO 2.7 - Handle the notificationclick event
self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
    const action = event.action;
    var url = "https://test19365.azurewebsites.net/";
  
    if (action === 'close') {
      notification.close();
    } else {
      clients.openWindow(url + primaryKey + '.html');
      notification.close();
    }
  
    // TODO 5.3 - close all notifications when one is clicked
  
  });
  
  

// TODO 3.1 - add push event listener
  self.addEventListener('push', event => {
    let body;
  
    if (event.data) {
      body = event.data.text();
    } else {
      body = 'Default body';
    }
  
    const options = {
      body: body,
      icon: 'images/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {action: 'explore', title: 'Go to the site',
          icon: 'images/checkmark.png'},
        {action: 'close', title: 'Close the notification',
          icon: 'images/xmark.png'},
      ]
    };
  
    event.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
  });
  
