const express = require ('express')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({extended:true})) //toto musíme zadat abychom parser mohli používat. kromě url encoded máme ještě text a json
app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html')
})
app.post('/', function(req, res){
    var num1 = parseInt(req.body.num1, 10)
    var num2 = parseInt(req.body.num2, 10)
    var final = num1 + num2;
    res.send(`Tvůj výsledek je ${final}`)
})
app.listen(3000, function(){
    console.log('running')
})