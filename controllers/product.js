const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
exports.getProductById = (req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"Product Not Found"
            })
        }
        req.product=product;
        next();
    })
}
exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            });
        }
        const {price,name,description,category,stock}=fields;

        //restriction on fields
        if(
            !name||
            !description||
            !price||
            !category||
            !stock
        ){
            return res.status(400).json({
                error:"Please include all fields"
            });
        }

        let product = new Product(fields);


        //handling the file
        if(file.photo){
            if(file.photo.size>=3000000){
                return res.status(400).json({
                    error:"File size is too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //Save to the DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Saving tshirt in DB failed"
                })
            }
        })
        res.json(product);
    })
}


exports.getProduct = (req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}
//middleware
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req,res)=>{
    let product = req.product;
    product.remove((err,deletedproduct)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to Delete the product"
            });
        }
        res.json({
            message:"Successfully deleted"
        })
    })
}

exports.updateProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            });
        }
        //updation  code
        let product = req.product;
        product = _.extend(product,fields)

        //handling the file
        if(file.photo){
            if(file.photo.size>=3000000){
                return res.status(400).json({
                    error:"File size is too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //Save to the DB
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Updation Failed"
                })
            }
        })
        res.json(product);
    })
}

//product listing 
exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit?parseInt(req.query.limit):8;
    let sortBy = req.query.sortBy?req.query.sortBy:"_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"NO product FOUND"
            })
        }
        return res.json(product);
    })
}

exports.updateStock = (req,res,next)=>{
    let myOperations = req.body.order.producs.map((prod)=>{
        return {
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock:-prod.count,sold:+prod.count}}
            }
        }
    });
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Bulk Operation failed"
            })
        }
        next();
    })
}

exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status
        }
    })
}