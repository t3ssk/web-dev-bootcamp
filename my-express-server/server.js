const express = require ('express');
const response  = require('express');
const path = require('path')
const app = express();


app.get("/", function(req, res){ //req = request, res = response 
    res.sendFile(path.join(__dirname + '/index.html')) //tady by mohlo být jen sen
})
app.get("/bio.html", function(req, res){
    res.sendFile(path.join(__dirname + '/bio.html'))
})

app.get('/hobbies', function(req, res){
    res.send('Mám ráda internet a šití')
})


app.listen(3000, function(){console.log('Listeining')})