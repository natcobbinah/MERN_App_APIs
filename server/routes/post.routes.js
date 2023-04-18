const express = require('express')
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignIn, postCtrl.listNewsFeed)

router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignIn, postCtrl.listByUser)

router.route('/api/posts/new/:userId')
    .post(authCtrl.requireSignIn, postCtrl.createPost)

router.route('/api/posts/photo/:postId')
    .get(postCtrl.postPhoto)

router.route('/api/posts/:postId')
    .delete(authCtrl.requireSignIn, postCtrl.isPoster, postCtrl.removePost);

router.route('/api/posts/like')
      .put(authCtrl.requireSignIn, postCtrl.likePost)

router.route('/api/posts/unlike')
      .put(authCtrl.requireSignIn, postCtrl.unlikePost)

router.route('/api/posts/comment')
      .put(authCtrl.requireSignIn, postCtrl.addComment)

router.route('/api/posts/uncomment')
      .put(authCtrl.requireSignIn, postCtrl.removeComment);

router.param('userId', userCtrl.userByID)

router.param('postId', postCtrl.postByID)


export default router