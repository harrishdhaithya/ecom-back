//imports
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");


//my Routes
const authRoute = require("./routes/auth.js");
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")

//DB Connection
const mongoDB = process.env.DATABASE;
mongoose.connect(mongoDB, {useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useCreateIndex:true
}).then(()=>{
    console.log("DB connected");
});
//middleWare
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
//Routes
app.use("/api",authRoute);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);











//Starting a server
const port = process.env.PORT||8000;
app.listen(port,()=>{
    console.log("Server is running at port "+port);
});
