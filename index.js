import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoute from './routes/AuthRoute.js';
import UserRoute from './routes/UserRoute.js';
import TicketRoute from './routes/TicketRoute.js';
import UploadRoute from './routes/UploadRoute.js';
import ForgotRoute from './routes/ForgotRoute.js';
import ResetRoute from './routes/ResetRoute.js';
import CommentRoute from './routes/CommentRoute.js';
import ChatRoute from './routes/ChatRoute.js';
import MessageRoute from './routes/MessageRoute.js';

/*
 * The "app" variable is an instance of the Express application.
 * This is the main object that we will attach our routes and middleware to.
 */
const app = express(); // Create a new instance of the Express application.

/*
 * The Express application is an instance of the Express application.
 * This is the main object that we will attach our routes and middleware to.
 */

/*
 * We're using the body-parser middleware to parse JSON and URL-encoded 
 * data in the request body. The limit option sets the maximum request 
 * body size we're willing to accept. The extended option allows us to 
 * accept nested objects and arrays.
 */
app.use(bodyParser.json({ 
    limit: '30mb',  // Set the maximum request body size to 30mb.
    extended: true // Allow nested objects and arrays.
})); 

/*
 * Attach the body-parser middleware to our app, but this time we're configuring 
 * it to parse URL-encoded data.
 */
app.use(bodyParser.urlencoded({ 
    limit: '30mb',  // Set the maximum request body size to 30mb.
    extended: true // Allow nested objects and arrays.
})); 

/*
 * Attach the cors middleware to our app. This allows cross-origin requests 
 * from any domain, which is not a security risk in our case because we 
 * don't have any sensitive data.
 */
app.use(cors()); 
/*
 * The "express.static" middleware is used to serve static files.
 * 
 * The first argument to "express.static" is the directory we want to serve 
 * static files from. In this case, we're serving static files from the 
 * "public" directory.
 * 
 * The static files will be available at the root URL of our API. For 
 * example, if we have a file named "index.html" in the "public" directory, 
 * it will be available at "/index.html".
 */
app.use(express.static('public'));

/*
 * Another use of the "express.static" middleware. This one is serving static 
 * files from a different directory. The files will be available at a 
 * different URL.
 * 
 * The first argument to "express.static" is the directory we want to serve 
 * static files from. In this case, we're serving static files from the 
 * "images" directory.
 * 
 * The second argument to "express.static" is the URL that the static files 
 * will be available at. In this case, the files will be available at 
 * "/images".
 * 
 * For example, if we have a file named "example.jpg" in the "images" 
 * directory, it will be available at "/images/example.jpg".
 */
app.use('/images', express.static('images')); 

/*
 * Load environment variables from the .env file. We're using the 
 * dotenv module to do this.
 */
dotenv.config();

/*
 * Establish a connection to the MongoDB database using the URL stored in the MONGO_DB environment variable.
 * If the connection is successful, start the server and log a success message to the console.
 * If the connection fails, log the error to the console.
 */
mongoose.connect(process.env.MONGO_DB) // Connect to the MongoDB database using the URL from the MONGO_DB environment variable.
    .then(() => {  // If the connection is successful
        app.listen(process.env.PORT, () => {  // Start the server and listen on the port specified in the PORT environment variable.
            console.log(`Listening on ${process.env.PORT}`)  // Log a success message to the console.
        })
    })
    .catch((error) => {  // If the connection fails
        console.log(error)  // Log the error to the console.
    })

/*
* Attach routes to our app
* The first argument of the "use" method is the URL path that the 
* routes will be attached to. For example, the path '/auth' 
* will be prepended to all routes defined in AuthRoute.
* The second argument is the router object that contains the routes.
*/
app.use('/auth', AuthRoute) // Attach all routes defined in AuthRoute to the '/auth' path.
app.use('/forgot-password', ForgotRoute) // Attach all routes defined in ForgotRoute to the '/forgot-password' path.
app.use('/reset-password', ResetRoute) // Attach all routes defined in ResetRoute to the '/reset-password' path.
app.use('/user', UserRoute) // Attach all routes defined in UserRoute to the '/user' path.
app.use('/ticket', TicketRoute) // Attach all routes defined in TicketRoute to the '/ticket' path.
app.use('/upload', UploadRoute) // Attach all routes defined in UploadRoute to the '/upload' path.
app.use('/comment', CommentRoute) // Attach all routes defined in CommentRoute to the '/comment' path.
app.use('/chat', ChatRoute) // Attach all routes defined in ChatRoute to the '/chat' path.
app.use('/message', MessageRoute) // Attach all routes defined in MessageRoute to the '/message' path.
