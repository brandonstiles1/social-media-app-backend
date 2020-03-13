const functions = require('firebase-functions');
const config = require('./util/config');

const app = require('express')();

const FBAuth = require('./util/FBAuth');

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