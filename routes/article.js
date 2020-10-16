const express = require('express');
const router = express.Router();
const firebaseDb = require('../connection/firebase_admin.js');
const { getTime } = require('../source/js/getTime');

// print an article
router.get('/article/:id', function (req, res) {
  const auth = req.session.uid;
  const id = req.params.id;
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

// add new response
router.post('/article/:id', function (req, res) {
  const id = req.params.id;
  const response = req.body.response;
  const responseId = firebaseDb.ref('responses/' + id).push();

  firebaseDb.ref('/user/' + req.session.uid).once('value')
    .then(function (snapshot) {
      const username = snapshot.val().username;

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