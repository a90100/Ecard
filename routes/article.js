var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');
var { getTime } = require('../source/js/getTime');

// 印出單一文章
router.get('/article/:id', function (req, res) {
  let auth = req.session.uid;
  let id = req.params.id;
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
      auth,
      article: snapshot.val(),
      responses: responses || [],
      username
    });
  })
})

// 新增回應
router.post('/article/:id', function (req, res) {
  let id = req.params.id;
  let response = req.body.response;
  let responseId = firebaseDb.ref('responses/' + id).push();

  firebaseDb.ref('/user/' + req.session.uid).once('value')
    .then(function (snapshot) {
      let username = snapshot.val().username;

      let responseContent = {
        'username': username,
        'time': getTime(),
        'response': response.replace(/\r\n/g, '<br>')
      }

      return firebaseDb.ref('responses/' + id + '/' + responseId.key).set(responseContent);
    })
    .then(function (snapshot) {
      res.redirect(`/article/${id}`);
    })
})

module.exports = router;