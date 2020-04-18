const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

// 127.0.0.1 means -- home (localhost)

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        password: '',
        database: 'brain'
    }
});


const app = express();
app.use(bodyParser.json())
app.use(cors())

// First Parameter should always be request
app.get('/', (req, res) => {
    res.send('This is working')
})

// Dependency injection 
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// Setting up a custom port
app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT }`)
})



/*

/ --> res = this is working
/signin --> POST = success or fail (send it via Post because info contains password)
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/