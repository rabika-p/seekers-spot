import multer from 'multer';

const storage = multer.diskStorage({
  //specify where to store the files
  destination: (req, file, cb) => {
    cb(null, './src/uploads'); 
  },
  //append the current timestamp, a random number and original filename by trimming whitespaces
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname.trim()); 
  },
});

export const upload = multer({ storage });
