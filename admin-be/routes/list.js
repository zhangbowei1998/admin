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
    .delete(listController.delete)
router.route('/one')
    .all(isSignin)
    .get(listController.findOne)
router.route('/update')
    .all(isSignin)
    .post(fileUpload.uploadFile,listController.update)
router.route('/find')
    .all(isSignin)
    .get(listController.findMany)
module.exports = router;
