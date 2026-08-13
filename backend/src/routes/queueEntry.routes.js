const express = require("express")
const router = express.Router()
const {cancel,myQueue}= require("../controllers/queueEntry.controller");
const {protect}= require("../middleware/auth.middleware");

router.post("/:id/cancel",protect,cancel);
router.get("/my",protect,myQueue)

module.exports = router;

