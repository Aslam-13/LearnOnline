const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// GET  /api/v1/bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) => { 

 
    res.status(200).json( res.advancedResults); 
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
  req.body.user = req.user.id;


  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id});
  if(publishedBootcamp && req.user.role!=='admin'){
    return next(new ErrorResponse(`The user with Id ${req.user.id} has already published a bootcamp`, 400));
  }
    const bootcamp = await Bootcamp.create(req.body); 
    res.status(200).json({ 
      success: true, 
      data: bootcamp}); 
 });

// UPDATE  /api/v1/bootcamps/:id 
exports.updateBootcamp =  asyncHandler(async (req, res, next) => { 
    let bootcamp = await Bootcamp.findById(req.params.id );
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    if(bootcamp.user.toString()!== req.user.id && req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))

    }
    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
       success: true,
        data: bootcamp}); 
});

// DELETE  /api/v1/bootcamps/:id 
exports.deleteBootcamp = asyncHandler( async (req, res, next) => { 
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    if(bootcamp.user.toString()!== req.user.id && req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401))

    }
    bootcamp.remove();
    res.status(200).json({
       success: true,
        data: { }});
 
});

// PUT /api/v1/bootcamps/:id/photo
exports.bootcampPhotoUpload = asyncHandler( async (req, res, next) => { 
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    if(bootcamp.user.toString()!== req.user.id && req.user.role!=='admin'){
      return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))

    }
    if(!req.files){
      return next(new ErrorResponse(`Please upload a file `, 400));
    }

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){
      return next(new ErrorResponse(`Please upload an image file`, 400));

    }

    if(file.size>process.env.MAX_FILE_UPLOAD){
      return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err=>{
      if(err){
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
      await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
      res.status(200).json({
        success: true,
        data: file.name
      })
    })
  
});