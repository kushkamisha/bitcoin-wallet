'use strict'

const express = require('express')
const wallet = require('../controllers/wallet')
const checkToken = require('../middleware/check-token')
const { checkWallet } = require('../middleware/bitcoin')
const router = express.Router()

router.route('/getBalance')
    .get(checkToken, checkWallet, wallet.getBalance)

router.route('/getTransactions')
    .get(checkToken, checkWallet, wallet.getTransactions)

router.route('/createAddress')
    .get(checkToken, checkWallet, wallet.createAddress)

router.route('/sendTransaction')
    .get(checkToken, checkWallet, wallet.sendTransaction)


module.exports = router
