import multer from "multer";


const storage = multer.memoryStorage(); // for buffer upload


export const upload = multer({ storage });
