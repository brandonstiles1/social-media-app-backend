const {admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer ')
    ) 
  {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // It's not enough to just HAVE a token. We have to know it was provided by OUR app
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
      console.log(data);
      // SOMETHING IS GOING WRONG RIGHT BELOW HERE 
      req.user.handle = data.docs[0].data().handle;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch(error => {
      console.error('Error while verifying token', error);
      return res.status(403).json(error);
    });
};