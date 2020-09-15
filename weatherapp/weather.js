const express = require ('express')
const https = require ('https')
const app = express();
const bodyParser = require ('body-parser')

app.use(bodyParser.urlencoded({extended:true}))
app.get('/', function(req, res){
   res.sendFile(__dirname + "/index.html")
})

app.post('/', function(req, res){
    let location = req.body.cityName
    let apiKey = "8ea06510d9296f7bfbef71d49c9cbffa"
    let unit = "metric"
    const url ='https://api.openweathermap.org/data/2.5/weather?q='+location+'&units='+unit+'&appid='+apiKey
    https.get(url, function(response){
        console.log(response.statusCode)
        response.on('data', function(data){
        const weatherData= JSON.parse(data)
        const place = weatherData.name
        const description = weatherData.weather[0].description
        const degrees = weatherData.main.temp
        const icon = weatherData.weather[0].icon
        res.send(`<div style="background-color: saddlebrown; color: white; padding-left: 10px;"><img src="http://openweathermap.org/img/wn/${icon}@2x.png"></img> <h1>The temperature in ${place} is ${degrees} degrees celsius.</h1><br><h2> It is currently ${description}</h2></div>`)
        })
        })
 
})

app.listen(3000, function(){
    console.log('Server running')
})



