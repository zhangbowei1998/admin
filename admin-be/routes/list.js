var express = require('express');
var router = express.Router();

const listController = require('../controllers/list')
const isSignin =require('../middleware/isSignin.1')
const fileUpload = require('../middleware/upload-file')

/* GET users listing. */
router.route('/')
    .all(isSignin)
    .get(listController.find)
    .post(fileUpload.uploadFile,listController.save)

module.exports = router;
