import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  //send a header to user's browser to empty all the info in the cookie (will remove the jwt)
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
