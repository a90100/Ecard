var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');

// 獲得全部已發布的文章
router.get('/index', function (req, res, next) {
  let auth = req.session.uid;
  console.log(req.session.search);
  firebaseDb.ref('articles').once('value', function (snapshot) {
    let articles = [];
    
    // 分類篩選
    if (req.query.category === undefined) {
      snapshot.forEach(function (snapshotChild) {
        articles.push(snapshotChild.val());
      })
    } else {
      snapshot.forEach(function (snapshotChild) {
        if (req.query.category === snapshotChild.val().category) {
          articles.push(snapshotChild.val());
        }
      })
    }

    // 搜尋篩選
    let length = articles.length;
    let tempArticles = [];
    if (req.session.search !== undefined) {
      console.log(req.session.search);
      for(let i = 0; i < length; i++) {
        // 假如文章標題有搜尋的字串時
        if ((articles[i].title.search(req.session.search)) !== -1) {
          tempArticles.push(articles[i]);
        }
      }
      console.log(tempArticles);
      articles = tempArticles;
    }

    articles = articles.reverse();
    req.session.search = undefined;
    res.render('index', {
      auth: auth,
      articles: articles
    });
  })
});

// 搜尋文章
router.post('/index', function (req, res) {
  req.session.search = req.body.search;
  res.redirect('/index');
})

module.exports = router;