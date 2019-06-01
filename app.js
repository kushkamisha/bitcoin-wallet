'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('./swagger.json')
const walletRoutes = require('./server/routes/wallet')
const authRoutes = require('./server/routes/auth')
const ratesRoutes = require('./server/routes/rates')
const viewsRoutes = require('./server/routes/web')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', viewsRoutes)
app.use('/auth', authRoutes)
app.use('/wallet', walletRoutes)
app.use('/rates', ratesRoutes)

module.exports = app
