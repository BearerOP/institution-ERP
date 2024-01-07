const express = require("express");
const router = express.Router();

const {
  account_settings,
} = require("../controllers/account_settings_controller.js");

router.get("/account_settings", account_settings);

module.exports = router;
