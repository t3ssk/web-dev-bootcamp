const express = require ('express')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({extended:true})) //toto musíme zadat abychom parser mohli používat. kromě url encoded máme ještě text a json
app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html')
})
app.get('/bmicalculator.html', function(req, res){
    res.sendFile(__dirname + "/bmiCalculator.html")
})
app.post('/', function(req, res){
    var num1 = parseInt(req.body.num1, 10)
    var num2 = parseInt(req.body.num2, 10)
    var final = num1 + num2;
    res.send(`Tvůj výsledek je ${final}`)
})

app.post('/bmicalculator.html', function (req, res){
    var height = Number(req.body.height)/100;
    var weight = Number(req.body.weight);
    var result = (weight/(height*height))

    
    if(result<18.5){
        res.send('You are underweight')
    }
    else if(result>18.5 && result<24.9){
        res.send('You are healthy weight')
    }
    else if(result>24.9 && result<29.9){
        res.send('You are overweight')
    }
    else if(result > 29.9){
        res.send('You are obese')
    }
    else{ res.send('Something went very wrong')}
       
           
})
app.listen(3000, function(){
    console.log('running')
})