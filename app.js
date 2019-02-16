'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const walletRoutes = require('./routes/wallet')
const app = express()

app.use(bodyParser.json())
app.use('/wallet', walletRoutes)

module.exports = app
