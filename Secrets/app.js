require('dotenv').config();
const express               = require ('express');
const bodyParser            = require ('body-parser');
const ejs                   = require('ejs');
const mongoose              = require('mongoose');
const md5                   = require('md5');
const session               = require('express-session');
const passport              = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')
const GoogleStrategy        = require('passport-google-oauth20').Strategy;
const FacebookStrategy      = require('passport-facebook').Strategy;
const findOrCreate          = require('mongoose-findorcreate');
const app        = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(session(
   { secret: process.env.SECRET, //nezapomeneme si ho v .env vyrobit
    resave: false, 
    saveUninitialized: false, 
}
))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect('mongodb://localhost:27017/secretsDB', {useNewUrlParser: true, useUnifiedTopology:true});
mongoose.set('useCreateIndex', true)
const db = mongoose.connection;

db.on('error', function () {console.log('Connection error')});
db.on('open', function () {console.log('Connection successfull')});


const userSchema = new mongoose.Schema({ 
    email: {
        type: String, 
        sparse: true},
    password: {
        type: String,
        minlength: [6, 'Your password is too short'],
        sparse: true
    },
    googleId: {
        type: String,
        sparse: true
    },
    facebookId: {
        type: String,
        sparse: true
    },
    username: {
        type: String,
        sparse: true
    },
    secret: {
        type: String,
        sparse: true
    }
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = mongoose.model('User', userSchema)

passport.use(User.createStrategy());
 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', function (req,res) {
    res.render('home')
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect('/secrets');
  });

app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['email'] }))
app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

app.get('/login', function (req,res) {
    res.render('login')
})
app.get('/register', function (req,res) {
    res.render('register')
})

app.get('/secrets', function (req,res) {
    User.find({'secret': {$ne:null}}, function (err, foundUsers) {
        if(err){console.log(err);}
        else{ if (foundUsers){
            res.render('secrets', {userSecrets: foundUsers})
        }}
    })
})
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
})
app.get('/submit', function (req,res) {
    if(req.isAuthenticated()){
        res.render('submit')
    } else {res.redirect('/login')}
})
app.post('/register', function (req, res) {
   User.register({username: req.body.username}, req.body.password, function (err, user) {
       if(err){console.log(err); res.redirect('/register')} else 
       {
           passport.authenticate('local')(req,res, function(){
               res.redirect('/secrets')
           })
       }
   })  
})
app.post('/submit',function (req,res) {
   const submittedSecret = req.body.secret
   console.log(req.user) 
   User.findById(req.user._id, function (err, foundUser) {
       if(err){console.log(err)} else {
           if(foundUser){
               foundUser.secret=submittedSecret;
               foundUser.save();
               res.redirect('/secrets')
           }
       }
   })
})


app.post('/login', function (req, res) {
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    })
   req.login(user, function(err){
       if(err){
           console.log(err);
           res.redirect('/login')
       } else {
           passport.authenticate('local')(req, res, function(){
              res.redirect('/secrets') 
           })
           
       }
   })
})





app.listen('3000', function(){
    console.log("Listening on server 3000");
})