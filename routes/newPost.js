var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');
var { getTime } = require('../source/js/getTime');
var multer = require("multer");
var imgurClientId = require('../connection/imgur_api');
var rp = require('request-promise');

var upload = multer({
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
          cb(null, true)
      } else {
          cb(null, false)
          return cb(new Error('Allowed only .png or .jpg'))
      }
  }
})

// 新增文章
router.post('/newPost', function (req, res) {
  let auth = req.session.uid;
  let content = req.body.content;
  
  firebaseDb.ref('user/' + auth).once('value')
  .then(function (snapshot) {
      let articleId = '';
      let username = snapshot.val().username;
      
      articleId = firebaseDb.ref('articles/').push(); // 隨機產生一個id
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
  let auth = req.session.uid;
  let content = req.body.content;

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

// 加入圖片
router.post('/addImg', upload.single('image'), function (req, res) {
  let encode_image = req.file.buffer.toString("base64");
  let articleId = '';
  if(!req.session.articleId) {
    articleId = firebaseDb.ref('articles/').push(); // 隨機產生一個id
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

// 進入新增文章頁面
router.get('/newPost', function (req, res) {
  let auth = req.session.uid;

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

// 進入編輯文章頁面
router.get('/newPost/:id', function (req, res) {
  let auth = req.session.uid;
  let articleId = req.params.id || '';
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