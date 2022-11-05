const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async')

// GET  /api/v1/bootcamps
exports.getBootcamps = asyncHandler(async (req, res, next) => { 

  let query;
  // copy of given string in url
  const reqQuery = { ...req.query }
  
  //fiels to exclude in result
  const removeFields = ['select', 'sort', 'page', 'limit' ];

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach(param=> delete reqQuery[param]);

  // creating string
  let queryStr = JSON.stringify(reqQuery);

  // create operators for mongodb
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  if(req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else {
    query = query.sort('-createdAt');
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page-1) * limit;
  const endIndex = page*limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);


  // Executing query
    const bootcamps = await query;

    const pagination = {};
    if(endIndex<total){
      pagination.next = {
        page: page+1,
        limit
      }
    }
    if(startIndex>0){
      pagination.prev = {
        page: page-1,
        limit
      }
    }
    res.status(200).json({
       success: true,
       count: bootcamps.length,
       pagination,
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