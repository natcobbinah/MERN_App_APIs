const mongoose = require('mongoose');
const { Schema } = mongoose;

/* It is possible for Node.js to be built without including support for the 
node:crypto module. In such cases, attempting to import from crypto or calling 
require('node:crypto') will result in an error being thrown.
When using CommonJS, the error thrown can be caught using try/catch: */

let crypto;
try {
    crypto = require('node:crypto');
} catch (err) {
    console.error('crypto support is disabled!');
}

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String,
    about: {
        type: String,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    following: [
        {
            type: mongoose.ObjectId,
            ref: 'Users'
        }
    ],
    followers: [
        {
            type: mongoose.ObjectId,
            ref: 'Users'
        }
    ]
})

UserSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return 'not password'
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return 'Encrypting password error'
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required for account')
    }
}, null)

export default mongoose.model('Users', UserSchema)

