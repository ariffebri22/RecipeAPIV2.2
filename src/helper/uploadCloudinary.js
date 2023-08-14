const cloudinary = require("../config/cloud");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "RecipeAPIV2",
//         allowed_formats: ["jpg", "png", "jpeg"],
//     },
// });

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
    },
});

const fileFilter = (req, file, cb) => {
    // Check if the file size is less than or equal to 5MB (5 * 1024 * 1024 bytes)
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || (file.mimetype === "image.jfif" && file.size <= 5 * 1024 * 1024)) {
        cb(null, true);
        req.isFileValid = true;
    } else {
        req.isFileValid = false;
        req.isFileValidMessage = "Files must be jpg, jpeg, png, and jfif, and should not exceed 5MB in size.";
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
