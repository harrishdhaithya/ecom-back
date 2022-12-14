const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { getOrderById, createOrder, updateStatus, getOrderStatus } = require("../controllers/order");
const { updateStock } = require("../controllers/product");

//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);

//Actual

//create

router.post("/order/create/:userId",
isSignedIn,
isAuthenticated,
pushOrderInPurchaseList,
updateStock,
createOrder
);


//read
router.get("/order/all/:userId",
isSignedIn,
isAuthenticated,
isAdmin,
getAllOrder
);

//status of order
router.get("/order/status/:userId",
isSignedIn,
isAuthenticated,
isAdmin,
getOrderStatus
)
router.put("/order/:orderId/status/:userId",
isSignedIn,
isAuthenticated,
isAdmin,
updateStatus
)

module.exports = router;