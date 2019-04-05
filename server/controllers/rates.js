'use strict'

const https = require('https')
const logger = require('../../logger')

const getRates = pairname => new Promise((resolve, reject) => {
    const pair = pairname ? pairname : 'btcusd'
    const externalApiUrl = 'https://api.cryptowat.ch/markets/summaries'

    https.get(externalApiUrl, res => {
        if (res.statusCode !== 200)
            reject(`Invalid status code: ${res.statusCode}`)

        let data = ''

        res.on('data', chunk => {
            data += chunk
        })

        res.on('end', () => {
            const json = JSON.parse(data)
            if (json.result) {
                const pairRes = json.result[`bitfinex:${pair}`]
                resolve({
                    price: pairRes.price.last,
                    change24h: pairRes.price.change.percentage
                })
            } else
                reject(`Can't parse the rates`)
        })

    }).on('error', err => {
        reject(err)
    })
})

const btcUsd = (req, res) => {
    const pair = 'btcusd'

    getRates(pair)
        .then(({ price, change24h }) => {
            res.send({
                status: 'success',
                pair: 'btc/usd',
                price,
                change24h
            })
        }, err => {
            logger.error(err)
            res.status(500).send({
                status: 'error',
                message: `Problem with getting rates for the pair '${pair}'`
            })
        })
}

module.exports = {
    btcUsd
}