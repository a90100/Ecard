const express = require('express');
const router = express.Router();
const firebaseDb = require('../connection/firebase_admin.js');
const { getTime } = require('../source/js/getTime');
const multer = require("multer");
const imgurClientId = require('../connection/imgur_api');
const rp = require('request-promise');

const upload = multer({
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
          cb(null, true)
      } else {
          cb(null, false)
          return cb(new Error('Allowed only .png or .jpg'))
      }
  }
})

// add new article
router.post('/newPost', function (req, res) {
  const auth = req.session.uid;
  const content = req.body.content;
  
  firebaseDb.ref('user/' + auth).once('value')
  .then(function (snapshot) {
      let articleId = '';
      let username = snapshot.val().username;
      
      articleId = firebaseDb.ref('articles/').push(); // generate random id
      articleId = articleId.toString().slice(45, 65);
      firebaseDb.ref('/articles/' + articleId).once('value', function (snapshot) {
        time = snapshot.val().time;
      })

      let articleInfo = {
        uid: req.session.uid,
        username,
        title: req.body.title,
        category: req.body.category,
        content,
        id: articleId,
        time: getTime(),
      }

      req.session.articleId = articleInfo.id;
      return firebaseDb.ref('/articles/' + articleInfo.id).set(articleInfo);
    })
    .then(function (snapshot) {
      res.redirect(`/article/${req.session.articleId}`);
    })
    .catch(function(e) {
      console.log(e);
    })
})

// 修改文章
router.post('/newPost/:id', function (req, res) {
  const auth = req.session.uid;
  const content = req.body.content;

  firebaseDb.ref('user/' + auth).once('value')
  .then(function (snapshot) {
      let username = snapshot.val().username;

      let articleInfo = {
        uid: req.session.uid,
        username,
        title: req.body.title,
        category: req.body.category,
        content,
        id: req.session.articleId,
        time: getTime(),
      }

      return firebaseDb.ref('/articles/' + articleInfo.id).set(articleInfo);
    })
    .then(function (snapshot) {
      res.redirect(`/article/${req.session.articleId}`);
    })
    .catch(function(e) {
      console.log(e);
    })
})

// insert image
router.post('/addImg', upload.single('image'), function (req, res) {
  let encode_image = req.file.buffer.toString("base64");
  let articleId = '';
  if(!req.session.articleId) {
    articleId = firebaseDb.ref('articles/').push(); // generate random id
    articleId = articleId.toString().slice(45, 65);
    req.session.articleId = articleId;
    firebaseDb.ref('/articles/' + req.session.articleId).set({'img': ''});
  }

  options = {
    'method': 'POST',
    'url': 'https://api.imgur.com/3/image',
    'headers': {
        'Authorization': 'Client-ID ' + imgurClientId
    },
    formData: {
        'image': encode_image
    }
  };

  rp(options)
    .then(function (body) {
        return JSON.parse(body).data.link;
    })
    .then(function (imgUrl) {
      return firebaseDb.ref('/articles/' + req.session.articleId + '/img').set(` <img&nbspsrc=${imgUrl}&nbspname="imgUrl"> `);
    })
    .then(function (snapshot) {
      res.redirect(`/newPost/${req.session.articleId}`);
    })
    .catch(function (err) {
        console.log(err);
    });
})

// enter newpost page
router.get('/newPost', function (req, res) {
  const auth = req.session.uid;

  firebaseDb.ref('user/' + auth).once('value', function (snapshot) {
    let article = {
      id: '',
      title: '',
      content: ''
    }

    res.render('newPost', {
      auth,
      username: snapshot.val().username,
      article
    });
  })
});

// enter edit article page
router.get('/newPost/:id', function (req, res) {
  const auth = req.session.uid;
  const articleId = req.params.id || '';
  req.session.articleId = articleId;

  let article = {}
  firebaseDb.ref('articles/' + articleId).once('value')
    .then(function (snapshot) {
      article = snapshot.val();

      if(article.img) {
        article.content += `${article.img}`;
        firebaseDb.ref('/articles/' + articleId + '/img').set('');
      }

      return firebaseDb.ref('user/' + auth).once('value');
    })
    .then(function (snapshot) {
      res.render('newPost', {
        auth,
        username: snapshot.val().username,
        article
      });
    })
});

module.exports = router;