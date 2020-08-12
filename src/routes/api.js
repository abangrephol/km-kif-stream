const express = require('express');
const controller = require('../controllers/api')

const router = express.Router();

router.get('/setLive/:isLive', controller.setLive)
router.get('/setStatic/:isStatic', controller.setStatic)
router.get('/setVideoStatic/:videoStatic', controller.setVideoStatic)

module.exports = router;