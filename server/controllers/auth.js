'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../../config')
const db = require('../../db')

const register = (req, res) => {

    if (!req.body.username)
        res.send({
            status: 'error',
            message: 'Username is not provided.'
        })

    if (!req.body.password)
        res.send({
            status: 'error',
            message: 'Password is not provided.'
        })
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    const username = req.body.username

    db.one(`
            insert into "Users" ("Username", "Password")
            values ('${username}', '${hashedPassword}')
            returning "UserId"`)
        .then(({ UserId }) => {
            // Create a token
            const token = jwt.sign({ UserId }, config.jwtSecret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            })

            res.send({ status: 'success', token })
        })
        .catch(err => {
            res.status(500).send({
                status: 'error',
                message: `Can't write to the database.`
            })
        })
        .finally(db.$pool.end)
}

const login = async (req, res) => {

    // if (!req.body.username)
    //     res.send({
    //         status: 'error',
    //         message: 'Username is not provided.'
    //     })

    // if (!req.body.password)
    //     res.send({
    //         status: 'error',
    //         message: 'Password is not provided.'
    //     })

    // const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    // const username = req.body.username

    // await db.open()
    // await db.query(`
    //         insert into "Users" ("Username", "Password")
    //         values ('${username}', '${hashedPassword}')
    //         returning "UserId"`)
    //     .then(response => {
    //         const id = response.res.rows[0].UserId

    //         if (response.err) return res.status(500).send({
    //             status: 'error',
    //             message: `Can't write to the database.`
    //         })

    //         // Create a token
    //         const token = jwt.sign({ id }, config.jwtSecret, {
    //             expiresIn: 60 * 60 * 24 // expires in 24 hours
    //         })

    //         res.send({
    //             status: 'success',
    //             token
    //         })
    //     })
    // await db.close()
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        res.status(200).send(decoded);
    })
}

module.exports = {
    register,
    login
}
