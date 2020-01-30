var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');

// 取得使用者發布的文章
router.get('/user', function (req, res, next) {
  let auth = req.session.uid;
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

      // 過濾非該使用者的文章
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

// 搭配刪除鍵
router.post('/user/delete', function (req, res) {
  firebaseDb.ref('articles/' + req.query.id).remove();
  res.redirect('/user');
})

// 搭配編輯鍵
router.post('/user/edit', function (req, res) {
  firebaseDb.ref('articles/' + req.query.id).once('value', function (snapshot) {
    res.redirect('/newPost?id=' + req.query.id);
  });
})

module.exports = router;