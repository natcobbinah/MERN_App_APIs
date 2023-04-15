const express = require('express')
import userCtrl from '../controllers/user.controller'
import authCtrl  from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create)

router.route('/api/users/:userId')
    .get(authCtrl.requireSignIn, userCtrl.read)
    .put(authCtrl.requireSignIn, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignIn, authCtrl.hasAuthorization, userCtrl.remove)

router.route('/api/users/photo/:userId')
      .get(userCtrl.photo, userCtrl.defaultPhoto)

router.route('/api/users/defaultPhoto')
      .get(userCtrl.defaultPhoto)

router.param('userId', userCtrl.userByID)

export default router