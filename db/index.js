'use strict'

const promise = require('bluebird')
const config = require('../config')
const pgp = require('pg-promise')({ promiseLib: promise })

const cn = {
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
}
const db = pgp(cn)
// pgp.end(); // shuts down all connection pools created in the process


module.exports = db
