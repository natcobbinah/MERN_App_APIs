const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    text: {
        type: String,
        required: 'Text is required',
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    postedBy: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.ObjectId,
        ref: 'Users'
    }],
    comments: [{
        text: String,
        created: {
            type: Date,
            default: Date.now
        },
        commentedBy: {
            type: mongoose.ObjectId,
            ref: 'Users'
        }
    }]
})

export default mongoose.model('Posts', PostSchema)