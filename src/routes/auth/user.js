const express = require("express");

const userRoutes = require("../../controllers/auth/user");

const router = express.Router();

// Post requests
router.post("/", userRoutes.postNewUser);
router.post("/log-in", userRoutes.postLogin);
router.post("/reset", userRoutes.postResetUser);

// Get requests
router.get("/reset:/token", userRoutes.getNewPassword);

module.exports = router;
