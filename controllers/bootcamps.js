const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async')

// GET  /api/v1/bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) => { 
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
       success: true,
       count: bootcamps.length,
        data: bootcamps}); 
});

// GET  /api/v1/bootcamps/:id 
exports.getBootcamp = asyncHandler(async (req, res, next) => { 
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
       success: true,
        data: bootcamp}); 
});

// POST  /api/v1/bootcamps 
exports.createBootcamp = asyncHandler(async (req, res, next) => { 
    const bootcamp = await Bootcamp.create(req.body); 
    res.status(200).json({ 
      success: true, 
      data: bootcamp}); 
 });

// UPDATE  /api/v1/bootcamps/:id 
exports.updateBootcamp =  asyncHandler(async (req, res, next) => { 
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
       success: true,
        data: bootcamp}); 
});

// DELETE  /api/v1/bootcamps/:id 
exports.deleteBootcamp = asyncHandler( async (req, res, next) => { 
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
       success: true,
        data: { }});
 
});