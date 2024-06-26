const {Order,ProductCart} = require("../models/order")


exports.getOrderById=(req,res,id,next)=>{
    Order.findById(id)
    .populate("product.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No Order found in DB"
            })
        }
        req.order = order;
        next();
    });
}

exports.createOrder = (req,res) =>{
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to save your order in DB"
            });
        }
        res.json(order);
    })
}

exports.getAllOrder = (req,res) =>{
    Order.find()
        .populate("user","_id name")
        .exec((err,orders)=>{
            if(err){
                return res.status(400).json({
                    error:"No orders found in DB"
                });
            }
            res.json(order);
        })
}

exports.getOrderStatus = (req,res)=>{
    res.json(Order.schema.path("status").enunnValues)
}

exports.updateStatus = (req,res)=>{
    Order.updateOne(
        {_id: req.body.orderId},
        {$set:{status:req.body.status}},
        (err,order)=>{
            if(err){
                return res.status(400).json({
                    error:"Cannot update order status"
                });
            }
            res.json(order);
        }

    )
}

