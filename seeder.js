const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({ path: './config/config.env'});

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});


const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));



const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
     await Course.create(courses);
     await User.create(users);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany( );
    await Course.deleteMany( );
    await User.deleteMany( );
    console.log('Data deleted...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}
if(process.argv[2]==='-i'){
  importData();
}else  if(process.argv[2]==='-d'){
  deleteData();
}