const express = require("express");
const { makepayment } = require("../controllers/stripepayment");
const {}=require("../controllers/auth")
const router = express.Router();

router.post("/stripepayment",makepayment)

module.exports = router;