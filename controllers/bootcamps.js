
// GET  /api/v1/bootcamps
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps'});
}

// GET  /api/v1/bootcamps/:id 
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show bootcamp ${req.params.id}`});
}

// POST  /api/v1/bootcamps 
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new bootcamp'});
}

// UPDATE  /api/v1/bootcamps/:id 
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}`});
}

// DELETE  /api/v1/bootcamps/:id 
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}`});
}