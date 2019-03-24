'use strict'

const express = require('express')
const auth = require('../controllers/auth')
const router = express.Router()

router.route('/register')
    .post(auth.register)

router.route('/login')
    .post(auth.login)

module.exports = router
