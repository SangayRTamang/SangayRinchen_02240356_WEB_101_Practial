const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    file.mimetype.startsWith('video/') ? cb(null, true) : cb(new Error('Only video files allowed!'), false);
  } else if (file.fieldname === 'thumbnail' || file.fieldname === 'avatar') {
    // ✅ Added 'avatar' here
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image files allowed!'), false);
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }
});

module.exports = { upload }; // ✅ single clean export