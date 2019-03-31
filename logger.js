/**
 * @module logger
 * Just logger
 * 
 * // throw new Error('error')
// logger.debug('Debugging info')
// logger.verbose('Verbose info')
// logger.info('Hello world')
// logger.warn('Warning message')
// logger.error('Error info')
 */

'use strict'

const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const config = require('./config')
const fs = require('fs')
const path = require('path')

const env = config.env || 'development'
const logDir = path.join(__dirname, 'log')

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const dailyRotateFileTransportResults = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
})

const dailyRotateFileTransportErrors = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-errors.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
})

const logger = createLogger({
    // change level if in dev environment versus production
    // To the file
    // Note: only level or greater will log to the console
    level: 'debug',
    format: format.combine(
        format.timestamp({
            format: 'HH:mm:ss'
        }),
        format.printf(
            info => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    // On the screen
    transports: [
        new transports.Console({
            level: env === 'development' ? 'debug' : 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransportResults
    ],
    exceptionHandlers: [
        new transports.Console({
            level: 'error',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransportErrors
    ]
})

module.exports = logger
