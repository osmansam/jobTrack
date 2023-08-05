const express = require("express");
const router = express.Router();

const { osman, deneme } = require("../controllers/DenemeController");

router.get("/osman", osman);
router.get("/deneme", deneme);
module.exports = router;
