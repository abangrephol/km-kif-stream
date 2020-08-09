const express = require('express');
const controller = require('../controllers/api')

const router = express.Router();

router.get('/setLive/:isLive', controller.setLive)

module.exports = router;