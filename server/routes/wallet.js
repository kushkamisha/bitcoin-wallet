'use strict'

const express = require('express')
const config = require('../../config')
const wallet = require('../controllers/wallet')
const mdl = require('../middleware')
const router = express.Router()

router.route(config.walletUrl.createAddress)
    .get(mdl.checkToken, mdl.bitcoinCliQuery, wallet.createAddress)

router.route(config.walletUrl.getBalance)
    .get(mdl.checkToken, mdl.bitcoinCliQuery, wallet.getBalance)

router.route(config.walletUrl.sendTransaction)
    .get(mdl.checkToken, wallet.sendTransaction)

router.route(config.walletUrl.getTransactions)
    .get(mdl.checkToken, wallet.getTransactions)


module.exports = router
