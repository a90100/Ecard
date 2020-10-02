var admin = require("firebase-admin");

var serviceAccount = require("../course-final-firebase-adminsdk-4orrv-b2d5b4638a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://course-final.firebaseio.com"
});

var db = admin.database();
module.exports = db;