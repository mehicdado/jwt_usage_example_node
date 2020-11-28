require('dotenv').config();
const express = require('express') 
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    //Do we have this refresh token and is it valid!
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToke({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => {
    console.log(refreshTokens)
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    console.log(refreshTokens)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    //Authenticate user
    const username = req.body.username
    //In reallife example we would need to verfy credentials against database for example.
    const user = { name: username }
    //If creadentials are correct we can create JWT Token and
    //give it back to user.
    const accessToken = generateAccessToke(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json(
        {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    )
})

function generateAccessToke(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'})
}

app.listen(4000)
