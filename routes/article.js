var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');

// 用query string完成...感動TAT，印出單一文章
router.get('/article', function (req, res) {
  let auth = req.session.uid;
  let id = req.query.id;
  req.session.id = id;
  req.session.articleId = '';
  let responses = [];
  let username = '';

  firebaseDb.ref('responses/' + id).once('value')
  .then(function (snapshot) {
    responses = snapshot.val();

    return firebaseDb.ref('articles/' + id).once('value');
  })
  .then(function (snapshot) {
    usrname = snapshot.val().username;
    res.render('article', {
      auth: auth,
      article: snapshot.val(),
      responses: responses || [],
      username: username
    });
  })
})

// 新增回應
router.post('/article', function (req, res) {
  let id = req.query.id;
  let response = req.body.response;
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let date = new Date().getDate();
  let hours = new Date().getHours();
  let minutes = new Date().getMinutes();
  let time = year + '年' + month + '月' + date + '日 ' + hours + ':' + minutes;
  let responseId = firebaseDb.ref('responses/' + id).push();

  firebaseDb.ref('/user/' + req.session.uid).once('value')
    .then(function (snapshot) {
      let username = snapshot.val().username;

      let responseContent = {
        'username': username,
        'time': time,
        'response': response
      }

      return firebaseDb.ref('responses/' + id + '/' + responseId.key).set(responseContent);
    })
    .then(function (snapshot) {
      res.redirect('/article?id=' + id);
    })
})

module.exports = router;