const mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost:27017/fruitsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection
db.on('error', function(){console.log('Connection error')})
db.once('open', function(){console.log('We are connected');})

const fruitSchema = new mongoose.Schema({
    type: {
        type: String, 
        required: true},
    price:  {
        type: Number,
        min: 6,
        max: 1000
    }, 
    review:{ 
        type: String,
        minlength: 10,
        maxlength: 100},
    stock: Number
})
const Fruit = mongoose.model('Fruit', fruitSchema)
const coconut = new Fruit({
    type: "Coconut",
    price: 90,
    review: "Fuzzy and wattery",
    stock: 36

})

coconut.save()

const pplSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favouriteFruit: fruitSchema
})

const Person = mongoose.model("people", pplSchema)


//james.save();
Person.updateOne({name: "James"}, {favouriteFruit: coconut}, function(err){
    if(err){console.log(err)} else {console.log("Change successful");}
})



/* Fruit.deleteOne({type: "Kiwi"}, function(err){
    if(err){console.log(err)} else 
    {console.log("Deleted successfully");}
}) */
/* Fruit.insertMany([kiwi, banana, pear], function(err){
    if(err){
        console.log(err);
    } else {
        console.log(`Fruits inserted successfull`);
    }
}) */

Fruit.find(function(err, fruits){
    if (err){
        console.log(err)
    } else {
        fruits.forEach((fruit)=> {console.log(fruit.type)})
        mongoose.connection.close()
    }
})



