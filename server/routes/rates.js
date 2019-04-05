'use strict'

const express = require('express')
const { btcUsd } = require('../controllers/rates')
const mdl = require('../middleware')
const router = express.Router()

router.route('/btcusd')
    .get(mdl.checkToken, btcUsd)

module.exports = router
