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



const homeStartingContent = "Na tomto blogu hodlám sdílet své myšlenky o nově započatém 100 days of code. Není to sice první den, co jsem začala na téhle věci pracovat, ale začnu odznova.  Čístě abych si mohla zaznamenávat a měřit svůj progress. A tohle bude takový můj log. Co mám, v plánu se naučit? Chtěla bych zabrousit do různých sfér fullstack web developlmentu. Ale chtěla bych se hlavně věnovat Reactu a Vue. Potrénuji i templating pro wordpress. A dál se uvidí."
const aboutContent = "Jmenuji se Tereza Konečná a tohle je moje cesta 100 dní plných kódování. Co asi za těch 100 dní dokážu?";
const contactContent = {
  mail: 'Te.konecna@icloud.com',
  instagram: 'https://instagram.com/t3ssk',
  github: 'https://github.com/t3ssk'}
const app = express();
const poststats = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function(req, res){

  res.render('home', {
    article: homeStartingContent,
    posts : poststats
    
    
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
  for(obj in poststats){
  title = poststats[obj].title
  if (_.kebabCase(topic) === _.kebabCase(title)){
    console.log('Match found')
  }
  res.render('post', {
        title: poststats[obj].title,
        post: poststats[obj].body,
  })}
  
})
app.post('/compose', function(req,res){
  const post = {
    title: req.body.title,
    body: _.truncate(req.body.blogpost, {'length': 300, 'separator': " "}),
    link: '/posts/'+ _.kebabCase(req.body.title)
  }
  poststats.push(post)
  res.redirect('/')
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
