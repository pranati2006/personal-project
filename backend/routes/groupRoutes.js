const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/:user_id', groupController.getGroups);
router.post('/create', groupController.createGroup);
router.post('/join', groupController.joinGroup);
router.post('/delete', groupController.deleteGroup);
router.post('/leave', groupController.leaveGroup);

module.exports = router;