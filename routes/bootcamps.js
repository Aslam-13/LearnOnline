const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, bootcampPhotoUpload} = require('../controllers/bootcamps')
 const advancedResults  = require('../middleware/advancedResults');
 const Bootcamp = require('../models/Bootcamp');
const {protect, authorize} = require('../middleware/auth');
// other resouces routers
const courseRouter = require('./courses');
// Re-route into other resource
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
  
module.exports = router;