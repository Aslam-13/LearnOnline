const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
// route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');

dotenv.config({path: './config/config.env'});


// connect to db
connectDB();


const app = express();

app.use(express.json());
app.use(cookieParser());

// login middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(fileupload());

app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, 'public')))
// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;


const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);


// handle unhandled promise rejecions
process.on('unhandledRejection', (err, promise)=>{
  console.log(`Error: ${err.message}`.red);
  // close server & exit process
  server.close(()=> process.exit(1));
})
