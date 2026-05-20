const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/reportConfigController');

router.get('/',                                controller.getConfig);
router.patch('/sections/:section',             controller.updateSection);
router.patch('/sections/:section/rows',        controller.updateRows);
router.post('/reset',                          controller.resetConfig);
 
module.exports = router;
 