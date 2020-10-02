var firebase = require('firebase');

var firebaseConfig = {
  apiKey: "AIzaSyAJVx9hubygh3ryIbw3vonqTzeQ8Gf4sNg",
  authDomain: "course-final.firebaseapp.com",
  databaseURL: "https://course-final.firebaseio.com",
  projectId: "course-final",
  storageBucket: "",
  messagingSenderId: "282697190735",
  appId: "1:282697190735:web:c69fb7d6172839cd"
};

firebase.initializeApp(firebaseConfig);
module.exports = firebase;