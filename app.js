const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000
const date = require(__dirname+'/date.js')



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"))

// To Do List Items

var items = ["EJS Project", "Blog Website", "Algorithm"];
var workItems = [];


// Main Page


app.get("/", function(req, res) {

//let day = date();

  res.render('index', {
    KindOfDay: date.getDate(),
    newItems: items
  });
})

app.post('/', function(req, res) {
  let item = req.body.newItem
  if(req.body.list==='Work List'){
    workItems.push(item);
    res.redirect('/work');
  }else{
  items.push(item);
  res.redirect('/');
}});

// Work Page

app.get('/work', function(req, res){
  res.render('index', {
    KindOfDay: "Work List",
    newItems: workItems
  });
});

app.get('/about', function(req,res){
  res.render('about');
})

app.listen(port, function() {
  console.log("It's running XD")
})
