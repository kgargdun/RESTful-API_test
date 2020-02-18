const express = require("express");
const app = express()
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/myDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,

});

const Article = mongoose.model("Article", articleSchema);


app.get("/articles", function(req, res) {
  Article.find(function(err, results) {
    if (err)
      res.send(err)
    else
      res.send(results);
  })
})

app.post("/articles", function(req, res) {
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  newArticle.save(function(err) {
    if (!err)
      res.send("Successful");
    else
      res.send(err);

  });
  // res.redirect("/articles");
})


app.delete("/articles", function(req, res) {
  Article.deleteMany({}, function(err) {
    if(err)
    res.send(err)
    else
    res.send("All deleted successful!");

  })

})


app.get("/articles/:specific_article",function(req,res)
{
  const articleTitle = req.params.specific_article;
  Article.findOne({title:articleTitle},function(err,result)
{
  if(err)
  console.log(err)
  else
  {
    if(result)
    {
        res.send(result);
    }
    else
    {
      res.send("No Matching Request");
    }

  }
})

});


app.put("/articles/:specific_article",function(req,res)
{
  const articleTitle = req.params.specific_article;
  Article.update({title:articleTitle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err,results)
{
  if(err)
  res.send(err)
  else
  res.send("Updated Successfully");
})

})


app.patch("/articles/:specific_article",function(req,res)
{
  const articleTitle = req.params.specific_article;
  Article.update({title:articleTitle},{$set:req.body},function(err,results)
  {
    if(err)
    res.send(err)
    else
    res.send("Updated Successfully");

  })

})



app.delete("/articles/:specific_article", function(req, res) {
  const articleTitle = req.params.specific_article;
  Article.deleteOne({title:articleTitle}, function(err) {
    if(err)
    res.send(err);
    else
    res.send("Deleted successfully!");

  })

})






app.listen(3000, function() {
  console.log("listening at port 3000");
})
