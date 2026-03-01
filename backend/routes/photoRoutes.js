const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

// Notice we use photoController.upload here
router.post('/upload', photoController.upload, photoController.addPhotosToGroup);
router.get('/group/:groupId', photoController.getGroupPhotos);
router.delete('/delete', photoController.deletePhotosFromGroup);

module.exports = router;