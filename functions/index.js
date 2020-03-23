const functions = require( 'firebase-functions' );
const app = require( 'express' )();
const config = require( './util/config' );
const FBAuth = require( './util/FBAuth' );

const { db } = require( './util/admin' );

const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream } = require( './handlers/screams' );
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require( './handlers/users' );

const cors = require( 'cors' );
app.use( cors() );

// SCREAM ROUTES
app.get( '/screams', getAllScreams ); // Get all screams
app.post( '/scream', FBAuth, postOneScream ); // Post one scream
app.get( '/scream/:screamId', getScream ); // Get & comment on single Scream
app.delete( '/scream/:screamId', FBAuth, deleteScream )
app.get( '/scream/:screamId/like', FBAuth, likeScream )
app.get( '/scream/:screamId/unlike', FBAuth, unlikeScream )
app.post( '/scream/:screamId/comment', FBAuth, commentOnScream ); // Lets a logged-in user comment on a Scream


// USERS ROUTES
app.post( '/signup', signup ); // Sign-up route
app.post( '/login', login ); // Login to app
app.post( '/user/image', FBAuth, uploadImage );
app.post( '/user', FBAuth, addUserDetails );
app.get( '/user', FBAuth, getAuthenticatedUser );

exports.api = functions.https.onRequest( app );

exports.createNotificationOnLike = functions.firestore
  .document( 'likes/{id}' )
  .onCreate( snapshot => {
    return db.doc( `/screams/${snapshot.data().screamId}` ).get()
      .then( doc => {
        if ( doc.exists && doc.data().userHandle !== snapshot.data().userHandle ) {
          return db.doc( `/notifications/${snapshot.id}` ).set( {
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          } )
        }
      } )
      .catch( error => {
        console.error( error );
      } );
  } );

exports.createNotificationOnComment = functions.firestore
  .document( 'comments/{id}' )
  .onCreate( snapshot => {
    return db.doc( `/screams/${snapshot.data().screamId}` ).get()
      .then( doc => {
        if ( doc.exists && doc.data().userHandle !== snapshot.data().userHandle ) {
          return db.doc( `/notifications/${snapshot.id}` ).set( {
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          } )
        }
      } )
      .catch( error => {
        console.error( error );
        return;
      } );
  } );

exports.deleteNotificationOnUnLike = functions.firestore
  .document( 'likes/{id}' )
  .onDelete( snapshot => {
    return db.doc( `/notifications/${snapshot.id}` )
      .delete()
      .catch( error => {
        console.error( error );
        return;
      } );
  } );

exports.onUserImageChange = functions.firestore.document( '/users/{userId}' )
  .onUpdate( change => {

    console.log( change.before.data() );
    console.log( change.after.data() );
    if ( change.before.data().imageUrl !== change.after.data().image ) {
      console.log( 'Image has changed' );
      const batch = db.batch();
      return db
        .collection( 'screams' )
        .where( 'userHandle', '==', change.before.data().handle )
        .get()
        .then( data => {
          data.forEach( doc => {
            const scream = db.doc( `/screams/${doc.id}` );
            batch.update( scream, { userImage: change.after.data().imageUrl } );
          } )
          return batch.commit();
        } );
    } else return true;
  } );

exports.onScreamDelete = functions.firestore.document( 'screams/{screamId}' )
  .onDelete( ( snapshot, context ) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection( 'comments' )
      .where( 'screamId', '==', screamId )
      .get()
      .then( data => {
        data.forEach( doc => {
          batch.delete( db.doc( `/comments./${doc.id}` ) );
        } )
        return db.collection( 'likes' ).where( 'screamId', '==', screamId ).get();
      } )
      .then( data => {
        data.forEach( doc => {
          batch.delete( db.doc( `/likes./${doc.id}` ) );
        } )
        return db.collection( 'notifications' ).where( 'screamId', '==', screamId ).get();
      } )
      .then( data => {
        data.forEach( doc => {
          batch.delete( db.doc( `/notifications./${doc.id}` ) );
        } )
        return batch.commit();
      } )
      .catch( error => console.error( error ) );
  } );