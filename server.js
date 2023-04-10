const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
// const { Configuration, OpenAIApi } = require('openai');
// const dotenv = require('dotenv');
// dotenv.config();

const register = require('./controllers/register');
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

// //hide API key
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI,
// });

// const openai = new OpenAIApi(configuration);
const app = express();

//connect to localhost database
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

//parse json data from frontend
app.use(express.json());
app.use(cors()); //apply middleware cors (security mechanism)

//res in json format
app.get('/', (req, res) => {
    res.send(db.users);
});

//need to receive from frontend body via HTTPS
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

//grab req.body -> enter new info to database
//pass params req,res,db,bcrypt to handleregister to use, instead of importing to register.js
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });


app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

//Counter
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

//API call to retrieve image
app.post('/imagePrompt', (req, res) => { image.handleApiCall(req, res) });



//host on server #
app.listen(8081, () => {
    console.log('app is running on port 8081')
});


/*
ROUTES TO WORK ON
/ --> res = this is working

/signin -> POST / res: success,fail
(using JSON body to send sensitive data/pw)

/register -> POST / res: return new created user
(add user info to database or variable in server)

/profile/:userID -> GET / res: return user
entering /: allows user to enter any number in browser to grab ID via request.params
(user profile w/ optional ID -> so each user has unique homescreen)

/image -> PUT -> return user or count/score
(when posting photo, need to change count of submitted photos)
(PUT bc updated score/count)
*/
