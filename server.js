require('dotenv').config();
const express = require('express') 
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const posts = [
    {
        username: 'Damir',
        title: 'This is post one!'
    },
    {
        username: 'Senad',
        title: 'Clean Architecture for Dummies!'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    //Return post only for currently logged in user.
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    //authenticate Token
    //format of the authHeader is Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)
