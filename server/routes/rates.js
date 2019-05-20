'use strict'

const express = require('express')
const { btcUsd } = require('../controllers/rates')
const { checkApiKey } = require('../middleware/check')
const router = express.Router()

router.route('/btcusd')
    .get(checkApiKey, btcUsd)

module.exports = router
