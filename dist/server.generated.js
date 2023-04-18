/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config/config.js":
/*!**************************!*\
  !*** ./config/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n\nconst CURRENT_WORKING_DIR = process.cwd();\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)({\n  path: path__WEBPACK_IMPORTED_MODULE_0___default().join(CURRENT_WORKING_DIR, './server/env/.env')\n});\nconst config = {\n  port: process.env.port,\n  mongoUri: process.env.MONGODB_URI,\n  jwtSecret: process.env.JWT_SECRET\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://users_crud_auth/./config/config.js?");

/***/ }),

/***/ "./server/controllers/auth.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/auth.controller.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/config */ \"./config/config.js\");\n\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nvar {\n  expressjwt\n} = __webpack_require__(/*! express-jwt */ \"express-jwt\");\n\nconst signin = async (req, res) => {\n  try {\n    let user = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n      \"email\": req.body.email\n    });\n    if (!user) {\n      return res.status(401).json({\n        error: \"User not found\"\n      });\n    }\n    if (!user.authenticate(req.body.password)) {\n      return res.status(401).json({\n        error: \"Email and password don't match.\"\n      });\n    }\n    const token = jwt.sign({\n      _id: user._id\n    }, _config_config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].jwtSecret);\n    res.cookie('t', token, {\n      expire: new Date() + 9999\n    });\n    return res.json({\n      token,\n      user: {\n        _id: user._id,\n        name: user.name,\n        email: user.email\n      }\n    });\n  } catch (err) {\n    return res.status(401).json({\n      error: \"Could not sign in\"\n    });\n  }\n};\nconst signout = (req, res) => {\n  res.clearCookie(\"t\");\n  return res.status(200).json({\n    message: \"Signed out\"\n  });\n};\nconst requireSignIn = expressjwt({\n  secret: _config_config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].jwtSecret,\n  userProperty: 'auth',\n  algorithms: [\"HS256\"]\n});\nconst hasAuthorization = (req, res, next) => {\n  const authorized = req.profile && req.auth && req.profile._id && req.auth._id;\n  if (!authorized) {\n    return res.status(403).json({\n      error: \"User is not authorized\"\n    });\n  }\n  next();\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  signin,\n  signout,\n  requireSignIn,\n  hasAuthorization\n});\n\n//# sourceURL=webpack://users_crud_auth/./server/controllers/auth.controller.js?");

/***/ }),

/***/ "./server/controllers/post.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/post.controller.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_post_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/post.model */ \"./server/models/post.model.js\");\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n\n\nconst {\n  IncomingForm\n} = __webpack_require__(/*! formidable */ \"formidable\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst listNewsFeed = async (req, res) => {\n  let following = req.profile.following; //array of users, the current user is following\n  following.push(req.profile._id); //id of current user\n  try {\n    let posts = await _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find({\n      postedBy: {\n        $in: req.profile.following //queries list of posts with postedBy tag \n      } //attributed to user or other users, the current\n    }) //current user is following\n    .populate('comments.commentedBy', '_id name').populate('postedBy', '_id name').sort('-created') //in descending order\n    .exec();\n    res.json(posts);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst listByUser = async (req, res) => {\n  try {\n    let posts = await _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find({\n      postedBy: req.profile._id\n    }).populate('comments.commentedBy', '_id name').populate('postedBy', '_id name').sort('-created').exec();\n    res.json(posts);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst createPost = (req, res) => {\n  let options = {\n    keepExtensions: true\n  };\n  let form = new IncomingForm(options);\n  form.parse(req, async (err, fields, files) => {\n    if (err) {\n      return res.status(400).json({\n        error: \"Image could not be uploaded\"\n      });\n    }\n    let post = new _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](fields);\n    post.postedBy = req.profile;\n    if (files.photo) {\n      post.photo.data = fs.readFileSync(files.photo.filepath);\n      post.photo.contentType = files.photo.mimetype;\n    }\n    try {\n      await post.save();\n      return res.json(post);\n    } catch (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n      });\n    }\n  });\n};\nconst postPhoto = (req, res, next) => {\n  res.set(\"Content-Type\", req.post.photo.contentType);\n  return res.send(req.post.photo.data);\n};\nconst postByID = async (req, res, next, id) => {\n  try {\n    let post = await _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id).populate('postedBy', '_id name').exec();\n    if (!post) {\n      return res.status(400).json({\n        error: 'Post not found'\n      });\n    }\n    req.post = post;\n    next();\n  } catch (err) {\n    return res.status(400).json({\n      error: \"Could not retrieve user post\"\n    });\n  }\n};\nconst isPoster = (req, res, next) => {\n  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;\n  if (!isPoster) {\n    return res.status(403).json({\n      error: \"User is not authorized\"\n    });\n  }\n  next();\n};\nconst removePost = async (req, res) => {\n  try {\n    let post = req.post;\n    let deletedPost = await post.deleteOne();\n    deletedPost.photo = undefined;\n    deletedPost.likes = undefined;\n    deletedPost.comments = undefined;\n    res.json(deletedPost);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst likePost = async (req, res) => {\n  try {\n    let result = await _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.postId, {\n      $push: {\n        likes: req.body.userId\n      }\n    }, {\n      new: true\n    });\n    res.json(result);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst unlikePost = async (req, res) => {\n  try {\n    let result = await _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.postId, {\n      $pull: {\n        likes: req.body.userId\n      }\n    });\n    res.json(result);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst addComment = async (req, res) => {\n  let comment = req.body.comment;\n  comment.commentedBy = req.body.userId;\n  try {\n    let result = await _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.postId, {\n      $push: {\n        comments: comment\n      }\n    }, {\n      new: true\n    }).populate('comments.commentedBy', '_id name').populate('postedBy', '_id name').exec();\n    res.json(result);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst removeComment = async (req, res) => {\n  let comment = req.body.comment;\n  try {\n    let result = await _models_post_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.postId, {\n      $pull: {\n        comments: {\n          _id: comment._id\n        }\n      }\n    }, {\n      new: true\n    }).populate('comments.commentedBy', '_id name').populate('postedBy', '_id name').exec();\n    res.json(result);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  listNewsFeed,\n  listByUser,\n  createPost,\n  postPhoto,\n  postByID,\n  isPoster,\n  removePost,\n  likePost,\n  unlikePost,\n  addComment,\n  removeComment\n});\n\n//# sourceURL=webpack://users_crud_auth/./server/controllers/post.controller.js?");

/***/ }),

/***/ "./server/controllers/user.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/user.controller.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n\n\nconst {\n  IncomingForm\n} = __webpack_require__(/*! formidable */ \"formidable\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst CURRENT_WORKING_DIR = process.cwd();\nconst path = __webpack_require__(/*! path */ \"path\");\nconst profileImage = path.join(CURRENT_WORKING_DIR, '/assets/images/defaultProfile.png');\nconst list = async (req, res) => {\n  try {\n    let users = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find().select('name email updated created');\n    res.json(users);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst create = async (req, res) => {\n  const user = new _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n  try {\n    await user.save();\n    return res.status(200).json({\n      message: \"Successfully signed up!\"\n    });\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst userByID = async (req, res, next, id) => {\n  try {\n    let user = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id).populate('following', '_id name').populate('followers', '_id name').exec();\n    if (!user) {\n      return res.status(400).json({\n        error: 'User not found'\n      });\n    }\n    req.profile = user;\n    next();\n  } catch (err) {\n    return res.status(400).json({\n      error: \"Could not retrieve user - you don't need this error\"\n    });\n  }\n};\nconst read = (req, res) => {\n  req.profile.hashed_password = undefined;\n  req.profile.salt = undefined;\n  return res.json(req.profile);\n};\nconst update = async (req, res) => {\n  let options = {\n    keepExtensions: true\n  };\n  let form = new IncomingForm(options);\n  form.parse(req, async (err, fields, files) => {\n    if (err) {\n      return res.status(400).json({\n        error: \"Photo could not be uploaded\"\n      });\n    }\n    let user = req.profile;\n    user = Object.assign(user, req.body); //copy req.body contents to user in-order to be updated\n    user.updated = Date.now();\n    if (files.photo) {\n      user.photo.data = fs.readFileSync(files.photo.filepath);\n      user.photo.contentType = files.photo.mimetype;\n    }\n    try {\n      await user.save();\n      user.hashed_password = undefined;\n      user.salt = undefined;\n      res.json(user);\n    } catch (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n      });\n    }\n  });\n};\nconst remove = async (req, res) => {\n  try {\n    let user = req.profile;\n    let deletedUser = await user.deleteOne();\n    deletedUser.hashed_password = undefined;\n    deletedUser.salt = undefined;\n    res.json(deletedUser);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst photo = (req, res, next) => {\n  if (req.profile.photo.data) {\n    res.set(\"Content-Type\", req.profile.photo.contentType);\n    return res.send(req.profile.photo.data);\n  }\n  next();\n};\nconst defaultPhoto = (req, res) => {\n  return res.sendFile(profileImage);\n};\nconst addFollowing = async (req, res, next) => {\n  try {\n    await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.actualUserId, {\n      $push: {\n        following: req.body.followId\n      }\n    });\n    next();\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst addFollower = async (req, res) => {\n  try {\n    let result = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.followId, {\n      $push: {\n        followers: req.body.actualUserId\n      }\n    }, {\n      new: true\n    }).populate('following', '_id name').populate('followers', '_id name').exec();\n    result.hashed_password = undefined;\n    result.salt = undefined;\n    res.json(result);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst removeFollowing = async (req, res, next) => {\n  try {\n    await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.actualUserId, {\n      $pull: {\n        following: req.body.unfollowId\n      }\n    });\n    next();\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst removeFollower = async (req, res) => {\n  try {\n    let result = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findByIdAndUpdate(req.body.unfollowId, {\n      $pull: {\n        followers: req.body.actualUserId\n      }\n    }, {\n      new: true\n    }).populate('following', '_id name').populate('followers', '_id name').exec();\n    result.hashed_password = undefined;\n    result.salt = undefined;\n    res.json(result);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\nconst findPeople = async (req, res) => {\n  let following = req.profile.following;\n  following.push(req.profile._id);\n  try {\n    let users = await _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find({\n      _id: {\n        $nin: following\n      }\n    }).select('name');\n    res.json(users);\n  } catch (err) {\n    return res.status(400).json({\n      error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getErrorMessage(err)\n    });\n  }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  list,\n  create,\n  read,\n  update,\n  remove,\n  userByID,\n  photo,\n  defaultPhoto,\n  addFollowing,\n  addFollower,\n  removeFollowing,\n  removeFollower,\n  findPeople\n});\n\n//# sourceURL=webpack://users_crud_auth/./server/controllers/user.controller.js?");

/***/ }),

/***/ "./server/express.js":
/*!***************************!*\
  !*** ./server/express.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _routes_user_routes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./routes/user.routes */ \"./server/routes/user.routes.js\");\n/* harmony import */ var _routes_auth_routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./routes/auth.routes */ \"./server/routes/auth.routes.js\");\n/* harmony import */ var _routes_post_routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./routes/post.routes */ \"./server/routes/post.routes.js\");\nconst express = __webpack_require__(/*! express */ \"express\");\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\nconst cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\nconst compress = __webpack_require__(/*! compression */ \"compression\");\nconst cors = __webpack_require__(/*! cors */ \"cors\");\nconst helmet = __webpack_require__(/*! helmet */ \"helmet\");\nconst path = __webpack_require__(/*! path */ \"path\");\nconst CURRENT_WORKING_DIR = process.cwd();\nconst swaggerUi = __webpack_require__(/*! swagger-ui-express */ \"swagger-ui-express\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst YAML = __webpack_require__(/*! yaml */ \"yaml\");\n\n\n\nconst app = express();\napp.use(bodyParser.json());\napp.use(bodyParser.urlencoded({\n  extended: true\n}));\napp.use(cookieParser());\napp.use(compress());\napp.use(helmet());\napp.use(cors());\napp.use('/', _routes_user_routes__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\napp.use('/', _routes_auth_routes__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\napp.use('/', _routes_post_routes__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n\n//swagger Configurations\nconst file = fs.readFileSync(path.join(CURRENT_WORKING_DIR, '/api/openapi.yaml'), 'utf8');\nconst swaggerDocument = YAML.parse(file);\nconst options = {\n  explorer: true\n};\napp.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));\n\n//auth related errors thrown by express-jwt when it tries to validate\n//JWT tokens in incoming requests\napp.use((err, req, res, next) => {\n  if (err.name === \"UnauthorizedError\") {\n    res.status(401).json({\n      \"error\": err.name + \" : \" + err.message\n    });\n  } else if (err) {\n    res.status(400).json({\n      \"error\": err.name + \" : \" + err.message\n    });\n    console.log(err);\n  }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n//# sourceURL=webpack://users_crud_auth/./server/express.js?");

/***/ }),

/***/ "./server/helpers/dbErrorHandler.js":
/*!******************************************!*\
  !*** ./server/helpers/dbErrorHandler.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst getErrorMessage = err => {\n  let message = '';\n  if (err.code) {\n    switch (err.code) {\n      case 11000:\n      case 11001:\n        message = getUniqueErrorMessage(err);\n        break;\n      default:\n        message = \"Something went wrong\";\n    }\n  } else {\n    for (let errName in err.errors) {\n      if (err.errors[errName].message) {\n        message = err.errors[errName].message;\n      }\n    }\n    return message;\n  }\n};\nconst getUniqueErrorMessage = err => {\n  let output;\n  try {\n    let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf(_1));\n    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';\n  } catch (ex) {\n    output = 'Unique field already exists';\n  }\n  return output;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  getErrorMessage\n});\n\n//# sourceURL=webpack://users_crud_auth/./server/helpers/dbErrorHandler.js?");

/***/ }),

/***/ "./server/models/post.model.js":
/*!*************************************!*\
  !*** ./server/models/post.model.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst {\n  Schema\n} = mongoose;\nconst PostSchema = new Schema({\n  text: {\n    type: String,\n    required: 'Text is required'\n  },\n  photo: {\n    data: Buffer,\n    contentType: String\n  },\n  postedBy: {\n    type: mongoose.ObjectId,\n    ref: 'Users'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  likes: [{\n    type: mongoose.ObjectId,\n    ref: 'Users'\n  }],\n  comments: [{\n    text: String,\n    created: {\n      type: Date,\n      default: Date.now\n    },\n    commentedBy: {\n      type: mongoose.ObjectId,\n      ref: 'Users'\n    }\n  }]\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose.model('Posts', PostSchema));\n\n//# sourceURL=webpack://users_crud_auth/./server/models/post.model.js?");

/***/ }),

/***/ "./server/models/user.model.js":
/*!*************************************!*\
  !*** ./server/models/user.model.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst {\n  Schema\n} = mongoose;\n\n/* It is possible for Node.js to be built without including support for the \r\nnode:crypto module. In such cases, attempting to import from crypto or calling \r\nrequire('node:crypto') will result in an error being thrown.\r\nWhen using CommonJS, the error thrown can be caught using try/catch: */\n\nlet crypto;\ntry {\n  crypto = __webpack_require__(/*! node:crypto */ \"node:crypto\");\n} catch (err) {\n  console.error('crypto support is disabled!');\n}\nconst UserSchema = new Schema({\n  name: {\n    type: String,\n    trim: true,\n    required: 'Name is required'\n  },\n  email: {\n    type: String,\n    trim: true,\n    unique: 'Email already exists',\n    match: [/.+\\@.+\\..+/, 'Please fill a valid email address'],\n    required: 'Email is required'\n  },\n  created: {\n    type: Date,\n    default: Date.now\n  },\n  updated: Date,\n  hashed_password: {\n    type: String,\n    required: \"Password is required\"\n  },\n  salt: String,\n  about: {\n    type: String,\n    trim: true\n  },\n  photo: {\n    data: Buffer,\n    contentType: String\n  },\n  following: [{\n    type: mongoose.ObjectId,\n    ref: 'Users'\n  }],\n  followers: [{\n    type: mongoose.ObjectId,\n    ref: 'Users'\n  }]\n});\nUserSchema.virtual('password').set(function (password) {\n  this._password = password;\n  this.salt = this.makeSalt();\n  this.hashed_password = this.encryptPassword(password);\n}).get(function () {\n  return this._password;\n});\nUserSchema.methods = {\n  authenticate: function (plainText) {\n    return this.encryptPassword(plainText) === this.hashed_password;\n  },\n  encryptPassword: function (password) {\n    if (!password) return 'not password';\n    try {\n      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');\n    } catch (err) {\n      return 'Encrypting password error';\n    }\n  },\n  makeSalt: function () {\n    return Math.round(new Date().valueOf() * Math.random()) + '';\n  }\n};\nUserSchema.path('hashed_password').validate(function (v) {\n  if (this._password && this._password.length < 6) {\n    this.invalidate('password', 'Password must be at least 6 characters.');\n  }\n  if (this.isNew && !this._password) {\n    this.invalidate('password', 'Password is required for account');\n  }\n}, null);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mongoose.model('Users', UserSchema));\n\n//# sourceURL=webpack://users_crud_auth/./server/models/user.model.js?");

/***/ }),

/***/ "./server/routes/auth.routes.js":
/*!**************************************!*\
  !*** ./server/routes/auth.routes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\nconst express = __webpack_require__(/*! express */ \"express\");\n\nconst router = express.Router();\nrouter.route('/auth/signin').post(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].signin);\nrouter.route('/auth/signout').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].signout);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://users_crud_auth/./server/routes/auth.routes.js?");

/***/ }),

/***/ "./server/routes/post.routes.js":
/*!**************************************!*\
  !*** ./server/routes/post.routes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/post.controller */ \"./server/controllers/post.controller.js\");\nconst express = __webpack_require__(/*! express */ \"express\");\n\n\n\nconst router = express.Router();\nrouter.route('/api/posts/feed/:userId').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].listNewsFeed);\nrouter.route('/api/posts/by/:userId').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].listByUser);\nrouter.route('/api/posts/new/:userId').post(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].createPost);\nrouter.route('/api/posts/photo/:postId').get(_controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].postPhoto);\nrouter.route('/api/posts/:postId').delete(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].isPoster, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].removePost);\nrouter.route('/api/posts/like').put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].likePost);\nrouter.route('/api/posts/unlike').put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].unlikePost);\nrouter.route('/api/posts/comment').put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].addComment);\nrouter.route('/api/posts/uncomment').put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requireSignIn, _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].removeComment);\nrouter.param('userId', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].userByID);\nrouter.param('postId', _controllers_post_controller__WEBPACK_IMPORTED_MODULE_2__[\"default\"].postByID);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://users_crud_auth/./server/routes/post.routes.js?");

/***/ }),

/***/ "./server/routes/user.routes.js":
/*!**************************************!*\
  !*** ./server/routes/user.routes.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\nconst express = __webpack_require__(/*! express */ \"express\");\n\n\nconst router = express.Router();\nrouter.route('/api/users').get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].list).post(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].create);\nrouter.route('/api/users/defaultPhoto').get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].defaultPhoto);\nrouter.route('/api/users/follow').put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].requireSignIn, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].addFollowing, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].addFollower);\nrouter.route('/api/users/unfollow').put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].requireSignIn, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].removeFollowing, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].removeFollower);\nrouter.route('/api/users/findPeople/:userId').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].requireSignIn, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findPeople);\nrouter.route('/api/users/:userId').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].requireSignIn, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].read).put(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].requireSignIn, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].update).delete(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].requireSignIn, _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].remove);\nrouter.route('/api/users/photo/:userId').get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].photo, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].defaultPhoto);\nrouter.param('userId', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"].userByID);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://users_crud_auth/./server/routes/user.routes.js?");

/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/config */ \"./config/config.js\");\n/* harmony import */ var _express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./express */ \"./server/express.js\");\n/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../template */ \"./template.js\");\n\n\n\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nmongoose.Promise = global.Promise;\nlet mongooseConnectOptions = {\n  useNewUrlParser: true,\n  /*  useCreateIndex: true, causes connection error when used */\n  useUnifiedTopology: true\n};\nconst connectDB = async () => {\n  try {\n    const conn = await mongoose.connect(_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].mongoUri, mongooseConnectOptions);\n    console.log(`MongoDB Connected: ${conn.connection.host}`);\n  } catch (error) {\n    console.log(error);\n    process.exit(1);\n  }\n};\n\n//Connect to the database before listening\nconnectDB().then(() => {\n  _express__WEBPACK_IMPORTED_MODULE_1__[\"default\"].listen(_config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port, err => {\n    if (err) {\n      console.log(err);\n    }\n    console.log(\"Server started on port %s.\", _config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port);\n    console.log('Swagger-ui is available on http://localhost:%d/docs', _config_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].port);\n  });\n});\n_express__WEBPACK_IMPORTED_MODULE_1__[\"default\"].get('/', (req, res) => {\n  res.status(200).send((0,_template__WEBPACK_IMPORTED_MODULE_2__[\"default\"])());\n});\n\n//# sourceURL=webpack://users_crud_auth/./server/server.js?");

/***/ }),

/***/ "./template.js":
/*!*********************!*\
  !*** ./template.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {\n  return `<!doctype html>\n      <html lang=\"en\">\n          <head>\n             <meta charset=\"utf-8\">\n             <title>MERN Skeleton</title>\n          </head>\n          <body>\n            <div id=\"root\">Hello World</div>\n          </body>\n      </html>`;\n});\n\n//# sourceURL=webpack://users_crud_auth/./template.js?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("express-jwt");

/***/ }),

/***/ "formidable":
/*!*****************************!*\
  !*** external "formidable" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("formidable");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "swagger-ui-express":
/*!*************************************!*\
  !*** external "swagger-ui-express" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("swagger-ui-express");

/***/ }),

/***/ "yaml":
/*!***********************!*\
  !*** external "yaml" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("yaml");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./server/server.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;