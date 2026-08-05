const express = require("express")
const router = express.Router()

const {create,getAll,getById,update,remove,join,next,getStatus}= require("../controllers/queue.controller");
const {protect,authorize}= require("../middleware/auth.middleware")

router.post("/",protect,authorize("admin"),create)
router.get("/",getAll);
router.get("/:id/status",getStatus);
router.get("/:id",getById);
router.put("/:id",protect,authorize("admin"),update)
router.delete("/:id",protect,authorize("admin"),remove)
router.post("/:id/join",protect,join);
router.post("/:id/next",protect,authorize("admin"),next);


module.exports = router;