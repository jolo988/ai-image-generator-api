const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

//controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')


const app = express();

//postgres Database
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '',
      database : 'smart-brain'
    }
  });

//Middleware: parse && cors security
app.use(express.json());
app.use(cors()); 

//home page end-point
app.get('/', (req, res) => {
    res.send(db.users);
});

//Signin end-point
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

//Register end-point
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

//Profile ID end-point
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

//Entries/Counter
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

//API call to retrieve image
app.post('/imagePrompt', (req, res) => { image.handleApiCall(req, res) });

//host on server #
app.listen(process.env.PORT || 8081, () => {
    console.log(`app is running on port ${process.env.PORT}`)
});
