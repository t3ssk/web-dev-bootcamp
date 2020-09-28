require('dotenv').config();

const express    = require ('express');
const bodyParser = require ('body-parser');
const ejs        = require('ejs');
const mongoose   = require('mongoose');
const encrypt    = require('mongoose-encryption');


mongoose.connect('mongodb://localhost:27017/secretsDB', {useNewUrlParser: true, useUnifiedTopology:true});
const db = mongoose.connection;

db.on('error', function () {console.log('Connection error')});
db.on('open', function () {console.log('Connection successfull')});

const app        = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({ 
    email: String,
    password: {
        type: String,
        minlength: [6, 'Your password is too short'],
        maxlength: [20, 'Your password is too long'],
    }
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

const User = mongoose.model('User', userSchema)

app.get('/', function (req,res) {
    res.render('home')
})
app.get('/login', function (req,res) {
    res.render('login')
})
app.get('/register', function (req,res) {
    res.render('register')
})

app.post('/register', function (req, res) {

    const newUser = new User({
        email   : req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if(!err){res.render('secrets')}
        else {res.send(err)}
    }) 
})

app.post('/login', function (req, res) {
    User.findOne({email: req.body.username}, function (err, foundUser) {
        if(!foundUser){
              res.send('User not found')
        } else {
        if(foundUser) {
            if(foundUser.password === req.body.password){
                res.render('secrets')
            } else { res.send('Wrong password')}
        } }
    })
    
})





app.listen('3000', function(){
    console.log("Listening on server 3000");
})