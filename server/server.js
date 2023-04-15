import config from "../config/config";
import app from "./express";
import template from "../template";
const mongoose = require('mongoose');

mongoose.Promise = global.Promise

let mongooseConnectOptions = {
    useNewUrlParser: true,
    /*  useCreateIndex: true, causes connection error when used */
    useUnifiedTopology: true
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri, mongooseConnectOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

//Connect to the database before listening
connectDB().then(() => {
    app.listen(config.port, (err) => {
        if (err) {
            console.log(err)
        }
        console.log("Server started on port %s.", config.port);
        console.log('Swagger-ui is available on http://localhost:%d/docs', config.port);
    });
})

app.get('/', (req, res) => {
    res.status(200).send(template());
})

