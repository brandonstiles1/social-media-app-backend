const admin = require('firebase-admin');

// const serviceAccount = require("../serviceAcctKey.json")

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://social-media-app-e5895.firebaseio.com/screams/K6nykGMIzVjKpA7TMCe9'
// });

admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };