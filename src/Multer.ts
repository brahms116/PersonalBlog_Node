import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: path.resolve("./uploads"),
    filename: (req, file, cb) => {
        cb(null, "temporarypost.txt");
    },
});

const upload = multer({ storage: storage });

export default upload;
