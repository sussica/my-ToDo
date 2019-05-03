const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var items = ["EJS Project", "Blog Website", "Algorithm"];


app.get("/", function(req, res) {

  var today = new Date();

  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  var date = today.toLocaleDateString("en-US", options);

  res.render('index', {
    KindOfDay: date,
    newItems:items
  });


})

app.post('/', function(req, res) {
  var item = req.body.newItem
  items.push(item);
  res.redirect('/');
});


app.listen(port, function() {
  console.log("It's running XD")
})
