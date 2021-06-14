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

// TODO 3.8 - push a message using the web push library
const webPush = require('web-push');

const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/ese3-hEwHxs:APA91bEN6mLejk_PfszXCcYqidmng_94vtxIfW8_4Sellg8LLded9ClD1rEtToTq7JvfbLIoRE1MuHkLyVKsIqfUpc85mTeVAD6l4-VRsFWmALtAzBMFYfRJbePGA6VoDDTHLiy59Rsi","expirationTime":null,"keys":{"p256dh":"BFtRkF9pMUq22AoJ3awl6-oePrPfQTUx_rD_Z5A5gD77dYBCRMdSjKxDIQ6Gz1mKCpxra1AqeV4YaOwtPJpZIgk","auth":"TukOTtmo9Zkq-QVRLuuFqQ"}};

// TODO 4.3a - include VAPID keys

const vapidPublicKey = 'BOdssltDDdSmfvPj6HHWsm5TVzWaRLyX0r1XR3fHF5J-LszxIWYIP-Rwhvb8cTnFJhuCs_fZSix_BoA4MNipFS8';
const vapidPrivateKey = '3KNOtTZHvQ6nEhHvvy_cNzgWr4gPnOs0FW9cN4siPlc';


const payload = 'Here is a payload!';

const options = {
//   gcmAPIKey: 'YOUR_SERVER_KEY',
  TTL: 60,

  // TODO 4.3b - add VAPID details
  vapidDetails: {
    subject: 'mailto: txen2000@gmail.com',
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey
  }
  

};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
