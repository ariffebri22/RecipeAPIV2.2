const app = require("express");
const router = app.Router();
const Recipe = require("./recipe");
const Category = require("./category");
const Users = require("./users");

router.use("/recipe", Recipe);
router.use("/category", Category);
router.use("/users", Users);
// router.use("/upload", uploadRouter);

module.exports = router;
