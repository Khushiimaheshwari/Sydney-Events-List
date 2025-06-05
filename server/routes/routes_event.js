const express = require("express");
const { getAllEvents } = require("../controllers/eventController");

const router = express.Router();
router.get("/", getAllEvents); 

module.exports = router;
