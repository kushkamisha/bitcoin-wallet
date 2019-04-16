'use strict'

const request = require('request')
const logger = require('../../logger')
const config = require('../../config')

/**
 * Execute a query for bitcoin-cli.
 * @param {string} method - Name of the method which should be executed.
 * @param {Array.string} params - (optional) Array of parameters for the method.
 * @param {string} id - (optional) Id of the query.
 * @param {string} network - (optional) Network type. Should be either 'testnet'
 * or 'regtest'.
 * @param {string} walletName - (optional) Name of the wallet from which query
 * should be executed.
 */
const btcQuery = ({
    method,
    params = [],
    id = method,
    network = 'regtest',
    walletName = ''
}) => new Promise((resolve, reject) => {
    logger.debug(JSON.stringify({ id, method, params }))
    const host = '127.0.0.1'
    const ports = {
        'testnet': 18332,
        'regtest': 18443
    }
    const port = ports[network] || ports.testnet
    const options = {
        url: `http://${host}:${port}/wallet/${walletName}`,
        method: 'POST',
        headers: { 'content-type': 'text/plain;' },
        body: JSON.stringify({ id, method, params }),
        auth: {
            'user': config.rpc.username,
            'pass': config.rpc.password
        }
    }

    request(options, (err, response, body) => {
        if (err) return reject(err)

        const result = JSON.parse(body)

        if (result.error)
            return reject(`
            Bitcoin node error.
            Code: ${result.error.code}
            Message: ${result.error.message}`)

        resolve(result.result)
    })
})

/**
 * Try to load wallet, but if it doesn't exist - create the one for the user.
 * @param {string} userId - User id for whom to create a wallet
 */
const loadWallet = userId => new Promise((resolve, reject) => {
    btcQuery({
        method: 'loadwallet',
        params: [userId]
    })
        .then(() => resolve())
        .catch(err => {
            const temp = err.substr(
                err.indexOf('Code: ') + 'Code: '.length)
            const errCode = parseInt(
                temp.substr(0, temp.indexOf('\n')))

            if (errCode !== -18) return reject(err)

            return btcQuery({
                method: 'createwallet',
                params: [userId]
            })
        })
        .then(() => resolve())
        .catch(err => reject(err))
})

/**
 * If user don't have wallet - try to load it from disk. If still nothing then
 * create one. 
 */
const checkWallet = (req, res, next) => {
    btcQuery({ method: 'listwallets' })
        .then(wallets => {
            if (!wallets.includes(`${req.locals.UserId}`))
                return loadWallet(req.locals.UserId.toString())
        })
        .then(() => next())
        .catch(err => {
            if (err instanceof Error) err = err.message
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: 'Internal server error.'
            })
        })
}


module.exports = {
    btcQuery,
    checkWallet,
}