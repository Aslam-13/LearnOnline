const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, bootcampPhotoUpload} = require('../controllers/bootcamps')
 const advancedResults  = require('../middleware/advancedResults');
 const Bootcamp = require('../models/Bootcamp');

// other resouces routers
const courseRouter = require('./courses');
// Re-route into other resource
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/:id/photo').put(bootcampPhotoUpload);
  
module.exports = router;