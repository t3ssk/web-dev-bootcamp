const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
app.set('view engine', 'ejs')


mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', function(){console.log('Connection error')})
db.once('open', function(){console.log('We are connected');})

const toDoSchema = mongoose.Schema({
    item: {
        type: String,
        require: true,
    }
})

const listSchema = mongoose.Schema({
    name: String,
    item: [toDoSchema],
       
    
})
const ToDoItem = mongoose.model('todoitem', toDoSchema);
const ListItem = mongoose.model('List', listSchema)
const vyprat = new ToDoItem({
    item:  "Vítej v To Do listu"
})
const vysat = new ToDoItem({
    item:  "Klikni na tlačítko +, abys přidala nový úkol"
})
const nadobi = new ToDoItem({
    item:  "<--- klikni na checkbox, abys smazala hotový úkol"
})
const defaults = [vyprat, vysat, nadobi]
app.get('/', function(req,res){
    title = 'Dnes máš na práci:'
   
    ToDoItem.find(function(err, items){if(err){console.log(err)} else {
        if(items.length === 0){
            
            ToDoItem.insertMany(defaults,function(err){
                if(err){console.log(err)} else {console.log('Data saved successfully');}
            }) 
            res.redirect('/')
        }
        else { res.render('list', {kindOfDay : title, coudelat: items})}}})
    
})                   

app.get('/:topic', function(req,res){
    let topic = _.capitalize(req.params.topic)
    //let title = _.capitalize(topic) 


    ListItem.findOne({name: topic}, function(err, foundList){
        if(err){console.log(err)} else
       {  if(!foundList) {
        const defaultList = new ListItem({
            name: topic,
            item: defaults
    })
           defaultList.save()
           res.redirect('/'+topic)
        } else {res.render('list', {kindOfDay: topic, coudelat: foundList.item})}}
        
        })
    })

                


app.post('/', function(req, res){
    const toDo = req.body.todo
    const listName =req.body.list
    console.log(req.body.list)
   
    const newItem = new ToDoItem({
        item: toDo
    })
    if (listName == "Dnes máš na práci:"){
        newItem.save() 
        res.redirect('/')
    } else {
        ListItem.findOne({name:listName}, function (err, foundItem) {
            if(err){console.log(err);} else{
                foundItem.item.push(newItem)
                foundItem.save()
                res.redirect('/' + listName)
            }
        }
        )
        

    }

    
})



app.post('/delete', function (req,res) {
    console.log(req.body)
    const checkbox = req.body.checkbox
    const listName = req.body.listName

    if (listName === 'Dnes máš na práci:'){
            ToDoItem.deleteOne({_id: checkbox}, function(err){
            if(err){console.log(err)} else {console.log('Deleted successfully');}
        })
            res.redirect('/')}
    else {
        ListItem.findOneAndUpdate({name:listName}, {$pull: {item: {_id: checkbox}}}, function(err, results){
           if(err){console.log(err);} else {
            
            res.redirect('/'+listName)
           }
        })
    }
})
app.listen(3000, function (){
    console.log('Server running on port 3000');
})

