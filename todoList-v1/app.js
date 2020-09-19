const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
app.set('view engine', 'ejs')
let toDos = [];

app.get('/', function(req,res){
    const date = new Date ();
    let daysOfWeek = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota']
    let day = daysOfWeek[date.getDay()]
    options = {  day: "numeric", month: "numeric", year: "numeric"}
    var datum=date.toLocaleDateString('en-us', options)
    console.log(day)
    
res.render('list', {kindOfDay : day, date: datum, coudelat: toDos})   //první argument - název ejs souboru vytvořeného ve views 
})                             //druhý argument: objekt s klíčem (název placeholderu v ejs souboru : proměnná, kterou odesíláme)
app.post('/', function(req, res){
    let item = req.body.todo
    toDos.push(item)
    res.redirect('/')
    console.log(toDos)

})
app.listen(3000, function (){
    console.log('Server running on port 3000');
})