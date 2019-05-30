'use strict'

const express = require('express')
const wallet = require('../controllers/wallet')
const { checkApiKey, checkUserId } = require('../middleware/check')
const { checkWallet } = require('../middleware/bitcoin')
const router = express.Router()

router.route('/getBalance')
    .get(checkApiKey, checkUserId, checkWallet, wallet.getBalance)

router.route('/getTransactions')
    .get(checkApiKey, checkUserId, checkWallet, wallet.getTransactions)

router.route('/createAddress')
    .get(checkApiKey, checkUserId, checkWallet, wallet.createAddress)

router.route('/sendTransaction')
    .get(checkApiKey, checkUserId, checkWallet, wallet.sendTransaction)

router.route('/newBlock')
    .get(checkApiKey, wallet.newBlock)


module.exports = router
