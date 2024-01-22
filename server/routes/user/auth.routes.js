const express = require('express')
import authCtrl from '../../controllers/user/auth.controller';

const router = express.Router()

router.route('/auth/signin')
      .post(authCtrl.signin)

router.route('/auth/signout')
      .get(authCtrl.signout)

export default router