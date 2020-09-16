const express = require ('express');
const bodyParser = require ('body-parser')
const https = require ('https')
//const request = require ('request')

const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html')
   
})
app.post('/', function(req, res){
    const mail = req.body.inputEmail;
    const fName = req.body.inputFName
    const lName = req.body.inputLName

   const data = { //vytvoříme data objekt, klíče musí být podle mailchimp
       members: [
           {
            email_address: mail, 
            status: "subscribed",
            merge_fields: {
                FNAME:fName,
                LNAME:lName
            }
           }
       ]
   }
   const jsonData = JSON.stringify(data) //mailchimp ale chce data v JSONu, takže

   const url = 'https://us2.api.mailchimp.com/3.0/lists/574d09e60a'
   const options = {
       method: "POST",
       auth: "terka:fe036a6d44048491de1c12f76edd30b7-us2"
   }
   const request = https.request(url, options, function(response){
       response.on('data', function(data){
           console.log(JSON.parse(data))
       })

       if(response.statusCode == 200){
           res.sendFile(__dirname + "/success.html")
       } else {
           res.sendFile(__dirname + '/failure.html')
       }
      
   } )
    request.write(jsonData)
    request.end()
})




app.listen(3000, function(){
    console.log("Server is running");
})


//const apiKey="fe036a6d44048491de1c12f76edd30b7-us2";
//const audienceKey = "574d09e60a"