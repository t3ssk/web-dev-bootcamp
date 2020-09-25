//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// Load the full build.
var _ = require('lodash');

// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
 
// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');
 
// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology:true})
const db = mongoose.connection
db.on('error', function(){console.log('Connection error')})
db.once('open', function(){console.log('We are connected')})

const blogSchema = mongoose.Schema({
  title: String,
  excerpt: String,
  body: String,
  link: String
})

const Blog = mongoose.model('blog', blogSchema)

const homeStartingContent = "Na tomto blogu hodlám sdílet své myšlenky o nově započatém 100 days of code. Není to sice první den, co jsem začala na téhle věci pracovat, ale začnu odznova.  Čístě abych si mohla zaznamenávat a měřit svůj progress. A tohle bude takový můj log. Co mám, v plánu se naučit? Chtěla bych zabrousit do různých sfér fullstack web developlmentu. Ale chtěla bych se hlavně věnovat Reactu a Vue. Potrénuji i templating pro wordpress. A dál se uvidí."
const aboutContent = "Jmenuji se Tereza Konečná a tohle je moje cesta 100 dní plných kódování. Co asi za těch 100 dní dokážu?";
const contactContent = {
  mail: 'Te.konecna@icloud.com',
  instagram: 'https://instagram.com/t3ssk',
  github: 'https://github.com/t3ssk'}
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function(req, res){

  Blog.find(function (err, poststats) {
    if(err){console.log(err)} else {
      res.render('home', {
        article: homeStartingContent,
        posts : poststats    
    })
    }
    
  })



})

app.get('/about', function(req,res){
  res.render('about', {about: aboutContent})
})

app.get('/contact', function(req,res){
  res.render('contact', {contact: contactContent})
})
app.get('/compose', function(req,res){
  res.render('compose')
})

app.get('/posts/:topic', function(req,res){
  let topic = req.params.topic;
  let title

  Blog.find(function(err, poststats) {
    if(err){console.log(err)} else {
      for(obj in poststats){
        title = poststats[obj].title
        if (_.kebabCase(topic) === _.kebabCase(title)){
          res.render('post', {
            title: poststats[obj].title,
            post: poststats[obj].body,
            id: poststats[obj]._id
      })
        }}
    }
  })

  
})
app.post('/compose', function(req,res){
  const blog = new Blog({
    title: req.body.title,
    excerpt: _.truncate(req.body.blogpost, {'length': 300, 'separator': " "}),
    body: req.body.blogpost,
    link: '/posts/'+ _.kebabCase(req.body.title)
  })
 
  blog.save()
  res.redirect('/')
})

app.post('/delete', function(req, res){
  console.log(req.body)
  Blog.deleteOne({_id: req.body.delete}, function(err) { 
    if(err){console.log(err)} else {console.log("Deleted successfully");}
    
  })
  res.redirect('/')
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

