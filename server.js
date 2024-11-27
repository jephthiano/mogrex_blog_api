const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser')


require('dotenv').config();
const port = process.env.PORT;

// SET SERVER CORS
const corsOptions = {
        origin: process.env.CLIENT_URL,
        allowedHeaders: "",
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PUT']
}
const app = express();


// SET SECURITY
//set message
const message = JSON.stringify({status:false,"message":"Too many requests from this IP, please try again later."})
// Define the rate limit rule
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: message
});

app.use(cors(corsOptions))// set cor
app.use(limiter);//set rate-limiting
app.use(express.json());
app.use(cookieParser()) //cookie parser
app.use(helmet());// set helmet for http security
app.use(xss()); //set express xss
app.use(mongoSanitize());// set express mongo sanitize


// CALLING FILES
// Declaring Global variables
global.__basedir = __dirname;
global.ADDONS = __basedir + '/addons/';
global.CONTROLLER = __basedir + '/addons/controller/';
global.ROUTER = __basedir + '/addons/routers/';
global.SCHEMA = __basedir + '/addons/schema/';
global.VALIDATORS = __basedir + '/addons/validators/';
global.CORE_CON = CONTROLLER + 'core/';
global.MISC_CON = CONTROLLER + 'misc/';


// DECLARING MIDDLEWARES
const Token = require(MISC_CON + 'token.cla');
const Request = require(MISC_CON + 'request.cla');
const DB = require(MISC_CON + 'database.cla');

// DECLARING ROUTERS
const auth = require(ROUTER + 'auth.rou');
const post = require(ROUTER + 'post.rou');

// SET INPUT DATA MIDDLEWARE
app.use(Request.setInputData);

// DB CONNECTION
DB.dbConn();

// USING ROUTERS
app.use("/auth",auth);  // auth route
app.use("/post", Token.verifyToken, post);  // blog route

// if no url is matched
app.use('*', (req, res) => {
  res.status(401).send('Invalid request');
})

app.listen(port, () => {
  console.log(`server is now up and running on port ${port}`)
});


