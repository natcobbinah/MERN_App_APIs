const express = require('express')
import userCtrl from '../../controllers/user/user.controller'
import authCtrl from '../../controllers/user/auth.controller'

const router = express.Router()

router.route('/api/users')
      .get(userCtrl.list)
      .post(userCtrl.create);
      
router.route('/api/users/defaultPhoto')
      .get(userCtrl.defaultPhoto);

router.route('/api/users/follow')
      .put(authCtrl.requireSignIn, userCtrl.addFollowing, userCtrl.addFollower);

router.route('/api/users/unfollow')
      .put(authCtrl.requireSignIn, userCtrl.removeFollowing, userCtrl.removeFollower);

router.route('/api/users/findPeople/:userId')
      .get(authCtrl.requireSignIn, userCtrl.findPeople);

router.route('/api/users/:userId')
      .get(authCtrl.requireSignIn, userCtrl.read)
      .put(authCtrl.requireSignIn, authCtrl.hasAuthorization, userCtrl.update)
      .delete(authCtrl.requireSignIn, authCtrl.hasAuthorization, userCtrl.remove);

router.route('/api/users/photo/:userId')
      .get(userCtrl.photo, userCtrl.defaultPhoto);

router.param('userId', userCtrl.userByID);

export default router