const express = require('express')
import userCtrl from '../../controllers/user/user.controller'
import authCtrl from '../../controllers/user/auth.controller'
import courseCtrl from '../../controllers/classroom/course.controller'
import enrollmentCtrl from '../../controllers/classroom/enrollment.controller'

const router = express.Router()

router.route('/api/enrollment/enrolled')
    .get(authCtrl.requireSignIn, enrollmentCtrl.listEnrolled)

router.route('/api/enrollment/stats/:courseId')
    .get(enrollmentCtrl.enrollmentStats)

router.route('/api/enrollment/new/:courseId')
    .get(authCtrl.requireSignIn, enrollmentCtrl.findEnrollment, enrollmentCtrl.createEnrollment)

router.route('/api/enrollment/:enrollmentId')
    .get(authCtrl.requireSignIn, enrollmentCtrl.isStudent, enrollmentCtrl.readEnrollments)

router.route('/api/enrollment/complete/:enrollmentId')
    .put(authCtrl.requireSignIn, enrollmentCtrl.isStudent, enrollmentCtrl.completedEnrollments)

router.param('courseId', courseCtrl.courseByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

export default router