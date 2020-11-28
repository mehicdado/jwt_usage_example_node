require('dotenv').config();
const express = require('express') 
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

let refreshTokens = []
let users = [
    "Damir",
    "Senad"
]

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    //Check do we have this refresh token and is it valid!
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    //Authenticate user
    const username = req.body.username
    //In reallife example we would need to verfy credentials against database for example.
    if(!users.includes(username)) return res.sendStatus(401)
    const user = { name: username }
    //If creadentials are correct we can create JWT Token and
    //give it back to user.
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    
    res.json(
        {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    )
})

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s'})
}

app.listen(4000)
