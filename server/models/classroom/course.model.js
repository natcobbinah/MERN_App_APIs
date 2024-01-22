const mongoose = require('mongoose');
const { Schema } = mongoose;
const { LessonSchema } = require('./lesson.model')

const CourseSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    category: {
        type: String,
        required: 'Category is required'
    },
    published: {
        type: Boolean,
        default: false,
    },
    instructor: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    lessons: [LessonSchema]
})

export default mongoose.model('Courses', CourseSchema)