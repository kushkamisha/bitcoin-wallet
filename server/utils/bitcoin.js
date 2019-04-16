'use strict'

const getBtcErrorCode = err => {
    const temp = err.substr(err.indexOf('Code: ') + 'Code: '.length)
    return parseInt(temp.substr(0, temp.indexOf('\n')))
}

module.exports = {
    getBtcErrorCode,
}