const express = require('express');
const router = express.Router();
const firebaseDb = require('../connection/firebase_admin.js');

// get all published articles
router.get('/index', function (req, res) {
  const auth = req.session.uid;
  firebaseDb.ref('articles').once('value', function (snapshot) {
    let articles = [];

    snapshot.forEach(function (snapshotChild) {
      articles.push(snapshotChild.val());
    })

    // search filter
    let length = articles.length;
    let tempArticles = [];
    if (req.session.search !== undefined) {
      for(let i = 0; i < length; i++) {
        // if search string is a part of article title
        if ((articles[i].title.search(req.session.search)) !== -1) {
          tempArticles.push(articles[i]);
        }
      }
      articles = tempArticles;
    }

    articles = articles.reverse();
    req.session.search = undefined;
    res.render('index', {
      auth,
      articles
    });
  })
});

// search article
router.post('/index', function (req, res) {
  req.session.search = req.body.search;
  res.redirect('/index');
})

module.exports = router;