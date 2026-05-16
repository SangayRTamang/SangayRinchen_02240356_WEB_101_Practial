const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload'); // ✅ correct

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.delete('/:id', protect, userController.deleteUser);
router.put('/:id', protect, upload.single('avatar'), userController.updateUser);

router.get('/:id/videos', userController.getUserVideos);
router.get('/:id/followers', userController.getUserFollowers);
router.get('/:id/following', userController.getUserFollowing);

router.post('/:id/follow', protect, userController.followUser);
router.delete('/:id/follow', protect, userController.unfollowUser);

module.exports = router;