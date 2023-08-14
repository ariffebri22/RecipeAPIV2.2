const express = require("express");
const router = express.Router();
const { getData, getDataById, deleteDataById, postData, putData, getDataDetail, login } = require("../controller/UsersController");
const { Protect } = require("./../middleware/Protect");
const upload = require("../helper/uploadCloudinary");

router.get("/", Protect, getData);
router.get("/detail", Protect, getDataDetail);
router.post("/login", login);
router.post("/", upload.single("photo"), postData);
router.put("/:id", Protect, upload.single("photo"), putData);
router.get("/:id", Protect, getDataById);
router.delete("/:id", Protect, deleteDataById);

module.exports = router;
