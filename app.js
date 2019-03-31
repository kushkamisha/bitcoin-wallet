'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('./swagger.json')
const walletRoutes = require('./server/routes/wallet')
const authRoutes = require('./server/routes/auth')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/wallet', walletRoutes)
app.use('/auth', authRoutes)

module.exports = app
