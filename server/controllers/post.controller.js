import Post from '../models/post.model';
import errorHandler from '../helpers/dbErrorHandler';
const { IncomingForm } = require('formidable');
const fs = require("fs")

const listNewsFeed = async (req, res) => {
    let following = req.profile.following; //array of users, the current user is following
    following.push(req.profile._id) //id of current user
    try {
        let posts = await Post.find({
            postedBy: {
                $in: req.profile.following //queries list of posts with postedBy tag 
            }                              //attributed to user or other users, the current
        })                                 //current user is following
            .populate('comments.commentedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created') //in descending order
            .exec();

        res.json(posts);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listByUser = async (req, res) => {
    try {
        let posts = await Post.find({
            postedBy: req.profile._id
        })
            .populate('comments.commentedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec();

        res.json(posts)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const createPost = (req, res) => {
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

        let post = new Post(fields);
        post.postedBy = req.profile;

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.filepath)
            post.photo.contentType = files.photo.mimetype
        }

        try {
            await post.save();
            return res.json(post);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const postPhoto = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}

const postByID = async (req, res, next, id) => {
    try {
        let post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .exec();
        if (!post) {
            return res.status(400).json({
                error: 'Post not found'
            })
        }

        req.post = post;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve user post"
        })
    }
}

const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth &&
        req.post.postedBy._id == req.auth._id;

    if (!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next();
}

const removePost = async (req, res) => {
    try {
        let post = req.post;
        let deletedPost = await post.deleteOne();
        deletedPost.photo = undefined;
        deletedPost.likes = undefined;
        deletedPost.comments = undefined;
        res.json(deletedPost)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const likePost = async (req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {
            $push: {
                likes: req.body.userId
            }
        }, { new: true });
        res.json(result);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const unlikePost = async (req, res) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: {
                likes: req.body.userId
            }
        })
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const addComment = async (req, res) => {
    let comment = req.body.comment;
    comment.commentedBy = req.body.userId;
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {
            $push: {
                comments: comment
            }
        }, { new: true })
            .populate('comments.commentedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(result);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        }) 
    }
}

const removeComment = async (req, res) => {
    let comment = req.body.comment;
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: {
                comments: { _id: comment._id }
            }
        }, { new: true })
            .populate('comments.commentedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        res.json(result);
    } catch (err) {
       return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        }) 
    }
}

export default {
    listNewsFeed, listByUser, createPost, postPhoto,
    postByID, isPoster, removePost, likePost, unlikePost,
    addComment, removeComment
}