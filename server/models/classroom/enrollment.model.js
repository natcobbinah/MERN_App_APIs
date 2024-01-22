const mongoose = require('mongoose');
const { Schema } = mongoose;

const EnrollmentSchema = new Schema({
    course: {
        type: mongoose.ObjectId,
        ref: 'Courses'
    },
    student: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    lessonStatus: [
        {
            lesson: {
                type: mongoose.ObjectId,
                ref: 'Lessons'
            },
            complete: Boolean
        }
    ],
    enrolled: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    completed: Date
})

export default mongoose.model('Enrollments', EnrollmentSchema)