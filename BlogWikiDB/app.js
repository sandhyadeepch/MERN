//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const methodOverride=require("method-override")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connecting to the mongoose database and creating a db named BlogDB
async function main() {
  await mongoose.connect('mongodb://localhost:27017/BlogDB');

}

main().catch(function(err) {
  console.log(err);
});

//Creating schema for blogDB
const postsSchema = new mongoose.Schema({
  title: {
    type:String,
    required:[true,"Title is required for the post"]
  },
  content:String
});

//Creating a collection for blogDB with singular name
const Post = mongoose.model("Post", postsSchema);

//Home page with all posts
app.get("/", function(req, res){
Post.find({},function(err,postsFound){
  if(err){
    console.log(err);
  }else{
    res.render("home", {
      startingContent: homeStartingContent,
      posts: postsFound
      });
  }
})

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

//retrieve post in editing mode
app.get("/posts/edit/:postID",function(req,res){
  const postID = req.params.postID;
  Post.findById(postID,function(err,post){
    if(err){
      console.log(err);
    }else{
      res.render("edit", {
        title: post.title,
        content: post.content,
        postID:post.id
      });
    }
  });
});

//Update post based on postID
app.post("/posts/edit/:postID",function(req,res){
  const postTitle=req.body.postTitle;
  const postContent=req.body.postBody;
  Post.findByIdAndUpdate(req.params.postID,{
    title:postTitle,
     content:postContent
  },function(err){
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });
}

);
//Delete post based on postID
app.get("/posts/delete/:postID",function(req,res){
  const postID=req.params.postID;
  Post.findByIdAndDelete(postID,function(err){
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });
});




//Add new post to database
app.post("/compose", function(req, res){
  const postTitle=req.body.postTitle;
  const postContent=req.body.postBody;
  const postInsert=new Post({title:postTitle,content:postContent});
  postInsert.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

});
//Get post on postID
app.get("/posts/:postID", function(req, res){
  const postID = req.params.postID;
  Post.findById(postID  ,function(err,post){
    if(err){
      console.log(err);
    }else{
      res.render("post", {
        title: post.title,
        content: post.content,
        postID:post.id
      });
    }
  });


  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
