const express = require('express');
const controller = require('../controllers/api')
const path = require('path')

const multer = require('multer')

const staticVideoStorage = multer.diskStorage({
    destination: path.resolve(__dirname, '../../public/videos/'),
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

const upload = multer({
    storage: staticVideoStorage
}).single('videoStatic');

const router = express.Router();

router.get('/setLive/:isLive', controller.setLive)
router.get('/setStatic/:isStatic', controller.setStatic)
router.get('/setVideoStatic/:videoStatic', controller.setVideoStatic)
router.post('/setting', upload, controller.setSettings)

module.exports = router;