var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin.js');

router.get('/category/:id', function (req, res) {
    let auth = req.session.uid;
    firebaseDb.ref('articles').once('value', function (snapshot) {
    let articles = [];
    
    // 分類篩選
    if (!req.params.id) {
        snapshot.forEach(function (snapshotChild) {
        articles.push(snapshotChild.val());
        })
    } else {
        snapshot.forEach(function (snapshotChild) {
        if (req.params.id === snapshotChild.val().category) {
            articles.push(snapshotChild.val());
        }
        })
    }

    articles = articles.reverse();
    res.render('index', {
        auth: auth,
        articles: articles
    });
    })
});

module.exports = router;