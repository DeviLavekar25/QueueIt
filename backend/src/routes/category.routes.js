const express = require("express")
const router = express.Router();
const {create,getAll,getById,update,remove} = require("../controllers/category.controller");
const {protect, authorize} = require("../middleware/auth.middleware")

router.post("/", protect, authorize("admin"),create);
router.get("/",getAll);
router.get("/:id",getById);
router.put("/:id",protect,authorize("admin"),update);
router.delete("/:id",protect,authorize("admin"),remove);

module.exports = router
