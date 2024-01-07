const express = require("express");
const router = express.Router();
const{libraryctrl}=require("../controllers/library_controller")
const{accctrl,payctrl, acc_details_ctrl}=require("../controllers/accounts_controller")
const{feesctrl}=require("../controllers/fees_controller")
const { student_register, student_registered,loginctrl,totalentryctrl} = require("../controllers/validation_controller");
const{updatectrl}=require("../controllers/update_controller")

//validation controller

router.post("/login",loginctrl)
router.get("/totalentry",totalentryctrl);

//update controller
router.post("/update",updatectrl);

//fees controller
router.get("/feesctrl",feesctrl)

//accounts controller
router.get("/account_details",acc_details_ctrl)
router.post("/accounts",accctrl)
router.post("/payment",payctrl)

//library controller
router.post("/library",libraryctrl)

module.exports = router;
