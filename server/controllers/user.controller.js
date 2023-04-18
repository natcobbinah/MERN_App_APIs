import User from '../models/user.model';
import errorHandler from '../helpers/dbErrorHandler';
const { IncomingForm } = require('formidable');
const fs = require("fs")
const CURRENT_WORKING_DIR = process.cwd()
const path = require('path');

const profileImage = path.join(CURRENT_WORKING_DIR, '/assets/images/defaultProfile.png')

const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created');
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();

        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        req.profile = user;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve user - you don't need this error"
        })
    }
}

const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile)
}

const update = async (req, res) => {
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

        let user = req.profile;
        user = Object.assign(user, req.body) //copy req.body contents to user in-order to be updated
        user.updated = Date.now()

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.filepath)
            user.photo.contentType = files.photo.mimetype
        }

        try {
            await user.save();
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}


const remove = async (req, res) => {
    try {
        let user = req.profile;
        let deletedUser = await user.deleteOne();
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next();
}

const defaultPhoto = (req, res) => {
    return res.sendFile(profileImage);
}

const addFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.actualUserId, {
            $push: {
                following: req.body.followId
            }
        })
        next();
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const addFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.followId, {
            $push: {
                followers: req.body.actualUserId
            }
        }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();

        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const removeFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.actualUserId, {
            $pull: {
                following: req.body.unfollowId
            }
        })
        next()
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const removeFollower = async (req, res) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: {
                followers: req.body.actualUserId
            }
        }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()

        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const findPeople = async (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id)

    try {
        let users = await User.find({
            _id: {
                $nin: following
            }
        }).select('name')

        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    list, create, read, update, remove, userByID,
    photo, defaultPhoto, addFollowing, addFollower,
    removeFollowing, removeFollower, findPeople
}
