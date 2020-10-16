const express = require('express');
const router = express.Router();
const firebaseDb = require('../connection/firebase_admin.js');

// get user's articles
router.get('/user', function (req, res, next) {
  const auth = req.session.uid;
  let username = '';
  let articles = [];
  let filteredArticles = [];
  firebaseDb.ref('user/' + auth).once('value')
    .then(function (snapshot) {
      username = snapshot.val().username;

      return firebaseDb.ref('articles').once('value');
    })
    .then(function (snapshot) {
      snapshot.forEach(function (snapshotChild) {
        articles.push(snapshotChild.val());
      })

      // filter not user's articles
      let articlesLength = articles.length;
      for (let i = 0; i < articlesLength; i++) {
        if (articles[i].uid === auth) {
          filteredArticles.push(articles[i]);
        }
      }

      res.render('user', {
        auth: auth,
        username: username,
        articles: filteredArticles
      });
    })
});

// delete article
router.post('/user/delete', function (req, res) {
  firebaseDb.ref('articles/' + req.query.id).remove();
  res.redirect('/user');
})

// edit article
router.post('/user/edit', function (req, res) {
  firebaseDb.ref('articles/' + req.query.id).once('value', function (snapshot) {
    res.redirect(`/newPost/${req.query.id}`);
  });
})

module.exports = router;