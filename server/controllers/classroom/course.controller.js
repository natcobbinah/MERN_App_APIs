import Course from '../../models/classroom/course.model'
import errorHandler from '../../helpers/dbErrorHandler';
const { IncomingForm } = require('formidable');
const fs = require("fs")
const CURRENT_WORKING_DIR = process.cwd()
const path = require('path');

const course_defaultImage = path.join(CURRENT_WORKING_DIR, '/assets/images/defaultCourseImage.jpg')

const courseImage = (req, res, next) => {
    if (req.course.image.data) {
        res.set("Content-Type", req.course.image.contentType)
        return res.send(req.course.image.data)
    }
    next();
}

const defaultCourseImage = (req, res) => {
    return res.sendFile(course_defaultImage);
}

const createCourse = (req, res) => {
    let options = {
        keepExtensions: true
    }
    let form = new IncomingForm(options);
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        let course = new Course(fields);

        if (files.image) {
            course.image.data = fs.readFileSync(files.image.filepath)
            course.image.contentType = files.image.mimetype
        }

        //add instructor to course
        course.instructor = req.profile._id

        try {
            let result = await course.save();
            res.json(result);
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const listByInstructor = async (req, res) => {
    try {
        let courses = await Course.find({ instructor: req.profile._id })
            .populate('instructor', '_id name')
            .exec()
        console.log(courses)
        res.json(courses)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const courseByID = async (req, res, next, id) => {
    try {
        let course = await Course.findById(id)
            .populate('instructor', '_id name')
        req.course = course
        next()
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: "Could not retrieve course"
        })
    }
}

const readCourseInfo = (req, res) => {
    req.course.image = undefined
    console.log(req.course)
    return res.json(req.course)
}

const isInstructor = (req, res, next) => {
    const isInstructor = req.course && req.auth && req.course.instructor._id == req.auth._id
    if (!isInstructor) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next()
}

const newLesson = async (req, res) => {
    try {
        console.log(req.body)
        let result = await Course.findByIdAndUpdate(req.course._id, {
            $push: {
                lessons: req.body
            },
            updated: Date.now()
        },
            { new: true })
            .populate('instructor', '_id name')
            .exec();

        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const updateCourseInfo = (req, res) => {
    let options = {
        keepExtensions: true
    }
    let form = new IncomingForm(options);

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }

        let course = req.course
        course = Object.assign(course, fields)

        if (fields.lessons) {
            course.lessons = JSON.parse(fields.lessons)
        }
        course.updated = Date.now()

        if (files.image) {
            course.image.data = fs.readFileSync(files.image.filepath)
            course.image.contentType = files.image.mimetype
        }

        try {
            await course.save()
            res.json(course)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }

    })
}

const removeCourse = async (req, res) => {
    try {
        let course = req.course
        let deleteCourse = await course.deleteOne()
        res.json(deleteCourse)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listPublished = async (req, res) => {
    try {
        let courses = await Course.find({ published: true })
            .populate('instructor', '_id name')
            .exec()

        res.json(courses)
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    createCourse, courseImage, defaultCourseImage, listByInstructor,
    courseByID, readCourseInfo, isInstructor, newLesson, updateCourseInfo, removeCourse,
    listPublished
}