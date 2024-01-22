const mongoose = require('mongoose');
const { Schema } = mongoose;

export const LessonSchema = new Schema({
    title: String,
    content: String,
    resource_url: String
})


