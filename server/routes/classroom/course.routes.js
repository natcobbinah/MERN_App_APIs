const express = require('express')
import userCtrl from '../../controllers/user/user.controller'
import authCtrl from '../../controllers/user/auth.controller'
import courseCtrl from '../../controllers/classroom/course.controller'

const router = express.Router()

router.route('/api/courses/published') //needs to placed above all other routes with params else, some 
    .get(courseCtrl.listPublished)                              // middlewares might interfere with it, causing error when retrieving data 


router.route('/api/courses/by/:userId')
    .post(authCtrl.requireSignIn, authCtrl.hasAuthorization,
        userCtrl.isEducator, courseCtrl.createCourse);

router.route('/api/courses/by/:userId')
    .get(authCtrl.requireSignIn, authCtrl.hasAuthorization, courseCtrl.listByInstructor)

router.route('/api/courses/:courseId')
    .get(courseCtrl.readCourseInfo)

router.route('/api/courses/:courseId/lesson/new')
    .put(authCtrl.requireSignIn, courseCtrl.isInstructor,
        courseCtrl.newLesson)

router.route('/api/courses/:courseId')
    .put(authCtrl.requireSignIn, courseCtrl.isInstructor,
        courseCtrl.updateCourseInfo)

router.route('/api/courses/:courseId')
    .delete(authCtrl.requireSignIn, courseCtrl.isInstructor,
        courseCtrl.removeCourse)

router.route('/api/courses/photo/:courseId')
    .get(courseCtrl.courseImage, courseCtrl.defaultCourseImage)

router.param('userId', userCtrl.userByID);
router.param('courseId', courseCtrl.courseByID)

export default router