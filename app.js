const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000
const mongoose = require('mongoose')
const _= require('lodash')
const favicon = require('serve-favicon');
const path = require('path');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use(express.static("public"))

mongoose.connect("mongodb+srv://Scarlett:test123@cluster0-dl5ow.mongodb.net/todolistDB", {
  useNewUrlParser: true
});

const todoSchema = {
  name: String
};

const Item = mongoose.model(
  "Item",
  todoSchema
);

const item1 = new Item({
  name: "Welcome to your todolist"
});

const item2 = new Item({
  name: "Hit the + to add a new item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const ListSchema = {
  name: String,
  items: [todoSchema]
};

const List = mongoose.model(
  'List',
  ListSchema
);



// Main Page


app.get("/", function(req, res) {

  //let day = date();
  Item.find({}, function(err, results) {
    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log('Insert default fails');
        } else {
          console.log('Successfully insert defaultItems');
        }
      })
      res.redirect('/');
    } else {
      res.render('index', {
        KindOfDay: "Today",
        newItems: results
      });
    }
  });


})

app.post('/', function(req, res) {
  const itemName = req.body.newItem;
  const ListName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (ListName === "Today") {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({
      name: ListName
    }, function(err, results) {
      results.items.push(item);
      results.save();
      res.redirect('/' + ListName);
    });
  }
});


app.post('/delete', function(req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;


  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemID, function(err) {
      if (err) {
        console.log('cannot removed' + checkedItemID);
      } else {
        console.log('Successfully removed' + checkedItemID);
        res.redirect('/');
      }
    })
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemID
        }
      }
    }, function(err, results) {
      if (!err) {
        console.log('delete Successfully');
        res.redirect('/' + listName);
      }
    })
  }
})

// Work Page



app.get("/:CustomListName", function(req, res) {
  const ListName = _.capitalize(req.params.CustomListName);

  List.findOne({
    name: ListName
  }, function(err, results) {
    if (!err) {
      if (!results) {
        const list = new List({
          name: ListName,
          items: defaultItems
        });
        list.save();
        res.redirect('/' + ListName);

      } else {
        res.render("index", {
          KindOfDay: ListName,
          newItems: results.items
        })
      }
    }
  })
});

app.get('/about', function(req, res) {
  res.render('about');
})

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
