'use strict'

const express = require('express')
const wallet = require('../controllers/wallet')
const mdl = require('../middleware')
const router = express.Router()

router.route('/createWallet')
    .get(mdl.checkToken, wallet.createWallet)

/** GET /wallet/create - Create wallet for the user */
router.route('/createAddress')
    .get(mdl.checkToken, wallet.createAddress)

router.route('/getMyMnemonic')
    .get(mdl.checkToken, wallet.getMyMnemonic)

router.route('/getLastBlock')
    .get(wallet.getLastBlock)


module.exports = router
