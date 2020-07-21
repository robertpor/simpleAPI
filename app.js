const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('Article', articleSchema);

/*
API Operations on the "/articles" route
*/
app
  .route('/articles')
  // GET all articles in Database
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  // Post new Article to Database
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save((err) => {
      if (!err) {
        res.send("'" + req.body.title + "'" + ' was saved successfully');
      } else {
        res.send(err);
      }
    });
  })
  // Delete alle articles in Database
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Deleted all items in DB');
      }
    });
  });

/*
API Operations on the "/articles/:specificArticle" route
*/

app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      if (article) {
        res.send(article);
      } else {
        res.send('No article matching that title');
      }
    });
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send('Successfully updated article');
        }
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send('Successfully updated article');
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send('Successfully deleted' + "'" + req.params.articleTitle + "'");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, () => {
  console.log('Server up and running on Port 3000');
});
