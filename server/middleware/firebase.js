'use strict'

const firebase = require('firebase')
require('firebase/auth')
require('firebase/database')

const config = {
    apiKey: 'AIzaSyCTFAnz5IQtTVggc-fjYwR3dfhUN2NkKDc',
    authDomain: 'bitwallet-mishakushka.firebaseapp.com',
    databaseURL: 'https://bitwallet-mishakushka.firebaseio.com',
    // projectId: 'bitwallet-mishakushka',
    storageBucket: 'bitwallet-mishakushka.appspot.com',
    messagingSenderId: '221397569008',
    // appId: '1:221397569008:web:b59b294530a5404a'
}

const app = firebase.initializeApp(config)

module.exports = app
