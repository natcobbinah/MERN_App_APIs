const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compress = require('compression');
const cors = require('cors');
const helmet = require("helmet");
const path = require('path');
const CURRENT_WORKING_DIR = process.cwd()
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

import userRoutes from './routes/user/user.routes'
import authRoutes from './routes/user/auth.routes'
import postRoutes from './routes/user/post.routes'
import courseRoutes from './routes/classroom/course.routes'
import enrollmentRoutes from './routes/classroom/enrollment.routes'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)
app.use('/', courseRoutes)
app.use('/', enrollmentRoutes)

//swagger Configurations
const file = fs.readFileSync(path.join(CURRENT_WORKING_DIR, '/api/openapi.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)
const options = {
    explorer: true
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

//auth related errors thrown by express-jwt when it tries to validate
//JWT tokens in incoming requests
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            "error": err.name + " : " + err.message
        })
    } else if (err) {
        res.status(400).json({
            "error": err.name + " : " + err.message
        })
        console.log(err)
    }
})

export default app;