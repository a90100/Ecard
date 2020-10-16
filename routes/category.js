const express = require('express');
const router = express.Router();
const firebaseDb = require('../connection/firebase_admin.js');

// category filter
router.get('/category/:id', function (req, res) {
    const auth = req.session.uid;
    firebaseDb.ref('articles').once('value', function (snapshot) {
    let articles = [];
    
    snapshot.forEach(function (snapshotChild) {
        if (req.params.id === snapshotChild.val().category) {
            articles.push(snapshotChild.val());
        }
    })

    articles = articles.reverse();
    res.render('index', {
        auth,
        articles
    });
    })
});

module.exports = router;