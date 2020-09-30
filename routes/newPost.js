var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');

// 新增文章和修改文章
router.post('/newPost', function (req, res) {
  let auth = req.session.uid;
  let content = req.body.content.replace(/\r\n/g, '<br>');
  
  firebaseDb.ref('user/' + auth).once('value')
  .then(function (snapshot) {
      let articleId = '';
      let username = snapshot.val().username;
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();
      let hours = new Date().getHours();
      let minutes = new Date().getMinutes();
      let time = year + '年' + month + '月' + date + '日 ' + hours + ':' + minutes;
      
      if (req.session.articleId == '' || undefined) {
        articleId = firebaseDb.ref('articles/').push(); // 隨機產生一個id
        articleId = articleId.toString().slice(45, 65);
      } else {
        articleId = req.session.articleId;
        firebaseDb.ref('/articles/' + articleId).once('value', function (snapshot) {
          time = snapshot.val().time;
        })
      }

      let articleInfo = {
        uid: req.session.uid,
        username: username,
        title: req.body.title,
        category: req.body.category,
        content: content,
        id: articleId,
        time: time
      }
      req.session.articleId = articleInfo.id;
      return firebaseDb.ref('/articles/' + articleInfo.id).set(articleInfo);
    })
    .then(function (snapshot) {
      res.redirect('/article?id=' + req.session.articleId);
    })
    .catch(function(e) {
      console.log(e);
    })
})

// 進入編輯文章頁面
router.get('/newPost', function (req, res, next) {
  let auth = req.session.uid;
  let articleId = req.query.id || '';
  req.session.articleId = articleId;

  if (articleId == '') {
    firebaseDb.ref('user/' + auth).once('value', function (snapshot) {
      let article = {
        title: '',
        content: ''
      }
      res.render('newPost', {
        auth: auth,
        username: snapshot.val().username,
        article: article
      });
    })
  } else {
    let article = {}
    firebaseDb.ref('articles/' + articleId).once('value')
      .then(function (snapshot) {
        article = snapshot.val();

        return firebaseDb.ref('user/' + auth).once('value');
      })
      .then(function (snapshot) {
        res.render('newPost', {
          auth: auth,
          username: snapshot.val().username,
          article: article
        });
      })
  }
});

module.exports = router;