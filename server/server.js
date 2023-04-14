import config from "../config/config";
import app from "./express";
import  template from "../template";
const mongoose = require('mongoose');

mongoose.Promise = global.Promise

let mongooseConnectOptions = {
    useNewUrlParser: true,
    /*  useCreateIndex: true, causes connection error when used */
    useUnifiedTopology: true
}
mongoose.connect(config.mongoUri, mongooseConnectOptions)
    .then(() => console.log('mongodbAtlas connected'))
    .catch(e => console.log(e))

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("Server started on port %s.", config.port);
    console.log('Swagger-ui is available on http://localhost:%d/docs', config.port);
});

app.get('/', (req, res) => {
    res.status(200).send(template());
})

/* 
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(config.mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
); */

/* async function run_MONGO_ATLASDB() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db(config.dbName).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run_MONGO_ATLASDB().catch(console.dir); */