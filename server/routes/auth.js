'use strict'

const express = require('express')
const auth = require('../controllers/auth')
const { checkToken } = require('../middleware')
const router = express.Router()

router.route('/register')
    .post(auth.register)

router.route('/login')
    .post(auth.login)

router.route('/getMyId')
    .post(checkToken, auth.getMyId)

module.exports = router
