'use strict'

const express = require('express')
const wallet = require('../controllers/wallet')
const router = express.Router()

/** GET /wallet/create - Create wallet for the user */
router.route('/createAddress')
    .get(wallet.createAddress)

router.route('/getLastBlock')
    .get(wallet.getLastBlock)

router.route('/testDatabase')
    .get(wallet.testDatabase)

module.exports = router
