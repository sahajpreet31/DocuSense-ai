const express = require("express");
const auth = require("../middleware/auth");
const { signup, login, updateProfile, changePassword } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/profile", auth, updateProfile);
router.put("/password", auth, changePassword);

module.exports = router;
