const express = require("express");
const multer = require("multer");
const checkAuth = require("../middlewares/auth_check");
const router = express.Router();
const ItemsControllers = require("../controllers/items");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const filename = `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`;
        cb(null, filename);
    }
});
const fileFilter = (req, file, cb) => {
    
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
const upload = multer({
    fileFilter: fileFilter,
    storage: storage,
    limits: 1024 * 1024 * 5
});


router.get("/", ItemsControllers.itemsGetItems);

router.get("/:itemId", checkAuth, ItemsControllers.itemsGetOneItem);

router.post("/", checkAuth, upload.single("itemImage"), ItemsControllers.itemsCreateItem);

router.post("/noImage",checkAuth,ItemsControllers.itemsCreateItemNoImage);

router.patch("/:itemId", checkAuth, ItemsControllers.itemsUpdateItem);

router.delete("/:itemId",checkAuth, ItemsControllers.itemsDeleteItem);



module.exports = router;