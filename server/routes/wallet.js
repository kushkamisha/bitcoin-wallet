'use strict'

const express = require('express')
const wallet = require('../controllers/wallet')
const mdl = require('../middleware')
const router = express.Router()

router.route('/createWallet')
    .get(mdl.checkToken, wallet.createWallet)

/** GET /wallet/create - Create wallet for the user */
router.route('/createAddress')
    .get(wallet.createAddress)

router.route('/getLastBlock')
    .get(wallet.getLastBlock)


module.exports = router
