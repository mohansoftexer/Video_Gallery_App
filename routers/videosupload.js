var express = require('express');
var router = express.Router();
var multer = require('multer');
var verificationToken = require('./VerificationToken')
var path = require('path')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/UploadVideoFiles/');
  },
  filename: function (req, file, cb) {
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var ext = path.extname(file.originalname);
    console.log(ext)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }
});
var fileFilter = (req, file, cb) => {
  var allowedTypes = ['video/mp4', 'video/mkv', 'video/x-matroska', 'video/avi'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};
router.post('/addvideo', verificationToken, upload.single('video'), async(req, res) => {
  var AddVideoUpload = require('../Controllers/VideoUpload/AddVideoUpload');
  AddVideoUpload.AddVideoUpload(req, res)
})

router.patch('/updatevideo', verificationToken, upload.single('video'), async(req, res) => {
  var UpdateVideoUpload = require('../Controllers/VideoUpload/UpdateVideoUpload');
  UpdateVideoUpload.UpdateVideoUpload(req, res)
})
router.post('/fetchvideo', verificationToken, async(req, res) => {
  var FetchVideos = require('../Controllers/VideoUpload/FetchVideos');
  FetchVideos.FetchVideos(req, res)
})
router.post('/sortvideos', verificationToken, async(req, res) => {
  var SortVideos = require('../Controllers/VideoUpload/SortVideos');
  SortVideos.sortVideos(req, res)
})
router.post('/filtervideos', verificationToken, async(req, res) => {
  var filtervideos = require('../Controllers/VideoUpload/FilterVideos');
  filtervideos.filtervideos(req, res)
})

module.exports = router;