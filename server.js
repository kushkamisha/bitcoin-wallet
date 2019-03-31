'use strict'

const app = require('./app')
const config = require('./config')
const logger = require('./logger')
const port = config.port || 3000

app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`)
})
