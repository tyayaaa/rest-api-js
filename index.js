const express = require('express')
const cors = require('cors')
const connect = require('./conn')

const app = express()
const port = 7000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.post('/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    connect.query('SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                throw err;
            }
            if (results.length > 0) {
                const user = {
                    username: results[0].username,
                    name: results[0].name,
                    email: results[0].email
                };
                res.json(user);
            } else {
                res.status(401).json({ message: 'Username or password is incorrect' })
            }
        })
})


app.get('/user', (req, res) => {
    connect.query('SELECT userid, username, name, email FROM users',
        (err, results) => {
            if (err) {
                throw err;
            }
            res.json(results)
        })
})

app.post('/user', (req, res) => {
    const { username, password, name, email } = req.body

    connect.query('INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)',
        [username, password, name, email],
        (err, result) => {
            if (err) {
                throw err
            }
            res.json({ message: 'Sign Up Successful', userid: result.insertId })
        })
})

app.listen(port, () => {
    console.log(`listening to ${port}`)
})