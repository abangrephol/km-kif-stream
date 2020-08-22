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

const excelStorage = multer.diskStorage({
    destination: path.resolve(__dirname, '../../public/excel/'),
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

const upload = multer({
    storage: staticVideoStorage
}).single('videoStatic');

const uploadExcel = multer({
    storage: excelStorage
}).single('excel');

const router = express.Router();

router.get('/setLive/:isLive', controller.setLive)
router.get('/setStatic/:isStatic', controller.setStatic)
router.get('/setVideoStatic/:videoStatic', controller.setVideoStatic)
router.post('/setting', upload, controller.setSettings)
router.post('/chatUser/allow', controller.chatUserAllow)
router.post('/chatUser/delete', controller.chatUserDelete)
router.get('/chatUser/win/:userId', controller.chatUserWin)
router.get('/prize/list', controller.prizeList)
router.post('/prize/upload', uploadExcel, controller.prizeXlsUpload)
router.get('/prize/win/:userId/:win', controller.prizeWin)
router.get('/prize/win/purge', controller.prizePurgeWinner)

module.exports = router;