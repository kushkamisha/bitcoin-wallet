'use strict'

const app = require('./app')
const config = require('./config')
const port = config.port || 3000

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
