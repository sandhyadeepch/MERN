//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//Connecting to the mongoose database and creating a db named todolistDB
async function main() {
  await mongoose.connect('mongodb://localhost:27017/todolistDB');
  //await mongoose.connect('mongodb+srv://DDMongo2022:EgrRoA6mZFi4Vez4@testclustertodolist.l7zi2.mongodb.net/todolistDB');

}

main().catch(function(err) {
  console.log(err);
});

//Creating schema for todolistDB
const itemsSchema = new mongoose.Schema({
  name: String
});

//Creating a collection for todolist DB with singular name
const Item = mongoose.model("Item", itemsSchema);

//Creating a doc for item collection
const item1 = new Item({
  name: "Welcome to your own to do list"
});
const item2 = new Item({
  name: "Click + to add new items to your list"
});
const item3 = new Item({
  name: "<-- Hit this to remove the item from the list"
});

const defalutItems = [item1, item2, item3];

const listSchema=new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});
const List=mongoose.model("List",listSchema);
app.get("/", function(req, res) {
  Item.find({}, function(err, itemsFound) {
    if (err) {
      console.log(err);
    } else if (itemsFound.length === 0) {
      Item.insertMany(defalutItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted new items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today",newListItems: itemsFound});
    }
  });
});

app.get("/:newList",function(req,res){
  const listName=_.capitalize(req.params.newList);

  List.findOne({name:listName},function(err,foundList){
  if(!err){
      if(!foundList){
        //Create a new list
        const list=new List({
          name:listName,
          items:defalutItems
        });
        list.save();
        res.redirect("/"+listName);
      }
      else{
        //Show the existing list
        res.render("list", {listTitle:foundList.name ,newListItems: foundList.items});

      }

    }
  });


});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName=req.body.list;
  const itemInsert=new Item({
    name:itemName
  });

  if(listName==="Today"){
    itemInsert.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName},function(err,listFound){
      listFound.items.push(itemInsert);
      listFound.save();
      res.redirect("/"+listName);
    });
  }



});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Removed item");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }


});


app.get("/about", function(req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//app.listen(port);

app.listen(port, function() {
  console.log("Server started on port 3000");
});
