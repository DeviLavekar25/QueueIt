const express = require("express")
const router = express.Router()
const {cancel}= require("../controllers/queueEntry.controller");
const {protect}= require("../middleware/auth.middleware");

router.post("/:id/cancel",protect,cancel);

module.exports = router;

