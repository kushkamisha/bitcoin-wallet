'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const walletRoutes = require('./server/routes/wallet')
const authRoutes = require('./server/routes/auth')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/wallet', walletRoutes)
app.use('/auth', authRoutes)

module.exports = app
