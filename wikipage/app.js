const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', function () {
    console.log('Connection error');
});
db.on('connect', function () {
    console.log('Connection successfull');
});

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('article', articleSchema);
/////////////////////////////////Všechny články/////////////////////////////////////////
app.route('/articles')
//GET
    .get(function (req,res) {
    Article.find(function (err, results) {
        if(!err){
            res.send(results)
        } else {res.send(err);}
    })
})


//POST
    .post(function (req,res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
    })
    newArticle.save(function (err) {
        if(!err){
            res.send('Save succesfull')
        } else {
            res.send(err)
        }
    })
})

//DELETE
.delete(function (req,res) {
    Article.deleteMany(function (err) {
        if(!err){
            res.send('Successfully deleted')
        } else {
            console.log(err);
        }
    })
});
///////////////////////////////////Specifický článek////////////////////////////
app.route('/articles/:adresa')
    .get(function(req,res){
        const adresa = req.params.adresa;
        Article.findOne({title: adresa}, function(err,result){
            if(!err){res.send(result)} else (res.send(err))
        })
    })
    .put(function (req, res){
        const adresa = req.params.adresa;
        const updates = req.body
       Article.update({title: adresa}, updates, {overwrite: true}, function (err, result) {
            if(!err){
                res.send(result)
            } else {res.send(err)}
        })
    })
    .patch(function (req,res) {
        const adresa = req.params.adresa;
        const update = req.body;
        Article.update({title: adresa}, {$set: update}, function (err,result) {
            if(!err){
                res.send(result)
            } else {
                res.send(err)
            }
        })
    })
    .delete(function(req,res){
        const adresa = req.params.adresa;
        Article.deleteOne({title: adresa}, function(err){
            if (!err){res.send("Deleted successfully")} else 
            {res.send(err)}
        })
    })

app.listen(3000, function () {
   console.log('Listening on server 3000'); 
})