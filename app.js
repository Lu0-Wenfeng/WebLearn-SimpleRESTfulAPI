const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO
const url = "mongodb://127.0.0.1:27017/wikiDB";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(url);
}

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

////////////Requests Targetting all articles

app.route("/articles")
  .get(async (req, res) => {
    try {
      const foundArticles = await Article.find();
      res.send(foundArticles);
    } catch (err) {
      res.status(404).json({ error: "Articles 4O4 -->: " + err });
    }
  })
  .post(async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      const result = await newArticle.save();
      console.log("Article added to DB successfully\n", result);
      res.status(201).send(newArticle);
    } catch (err) {
      res.status(500).json({ error: "Addition failed -->: " + err });
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Article.deleteMany({});
      console.log("Successfully deleted all articles!(O.O)\n", result);
      res.status(204).json("Successfully deleted all articles!(O.O)");
    } catch (err) {
      res.status(500).json({ error: "Deletion failed -->: " + err });
    }
  });

////////////////Requests targetting specific articles/////
app.route("/articles/:articleTitle")
  .get(async (req, res) => {
    try {
      const foundArticle = await Article.findOne({ title: req.params.articleTitle });
      res.send(foundArticle);
    } catch (err) {
      res.status(404).json({ error: "Article not found -->: " + err });
    }
  })
  .put(async (req, res) => {
    try {
      const updatedArticle = await Article.replaceOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content });
        console.log(updatedArticle);
        res.status(200).send(updatedArticle);
    } catch (err) {
      res.send(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const patchedArticle = await Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
      );
      res.send(patchedArticle);
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const removeTitle = req.params.articleTitle;
      const result =  await Article.deleteOne(
        {title: removeTitle}
        );
      res.status(200).send(result);
    } catch (err) {
      res.send(err);
    }
  });


app.listen(3000, function (err) {
  if (err) console.log(err);
  console.log("Server started on port 3000");
});


