const functions = require('firebase-functions');
const app = require('express')();
const config = require('./util/config');
const FBAuth = require('./util/FBAuth');

const { db } = require('./util/admin');

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } = require('./handlers/screams');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

// SCREAM ROUTES
app.get('/screams', getAllScreams); // Get all screams
app.post('/scream', FBAuth, postOneScream); // Post one scream
app.get('/scream/:screamId', getScream); // Get & comment on single Scream
app.delete('/scream/:screamId', FBAuth, deleteScream)
app.get('/scream/:screamId/like', FBAuth, likeScream)
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
app.post('/scream/:screamId/comment', FBAuth, commentOnScream); // Lets a logged-in user comment on a Scream


// USERS ROUTES
app.post('/signup', signup); // Sign-up route
app.post('/login', login); // Login to app
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          })
        }
      })
      .then(() => {
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  })

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
  .onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          })
        }
      })
      .then(() => {
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  })

exports.deleteNotificationOnUnLike = functions
  .firestore.document('likes/{id}')
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(error => {
        console.error(error);
        return;
      });
  })