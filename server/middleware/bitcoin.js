'use strict'

const request = require('request')
const logger = require('../../logger')
const config = require('../../config')

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
        // url: 'http://127.0.0.1:18332/', // testnet
        // url: 'http://127.0.0.1:18443/', // regtest
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
 * If user don't have wallet - create one. 
 */
const checkWallet = (req, res, next) => {
    btcQuery({ method: 'listwallets' })
        .then(wallets => {
            if (!wallets.includes(`${req.locals.UserId}`))
                return btcQuery({
                    method: 'createwallet',
                    params: [req.locals.UserId.toString()]
                })
        })
        .then(() => {
            next()
        })
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