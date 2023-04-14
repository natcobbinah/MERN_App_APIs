import path from 'path'
const CURRENT_WORKING_DIR = process.cwd();
require('dotenv').config({
    path: path.join(CURRENT_WORKING_DIR, './server/env/.env')
});

const config = {
    port: process.env.port,
    mongoUri :  process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
}

export default config;