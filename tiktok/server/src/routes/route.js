const { protect } = require('../middleware/auth');

router.post('/videos', protect, createVideo);  // only logged-in users
router.get('/videos', getVideos);              // public