'use strict'

const create = (req, res) => {
    res.send({
        status: 'OK',
        publicKey: '1Tk...',
        privateKey: '5JmV...'
    })
}

module.exports = {
    create,
}
