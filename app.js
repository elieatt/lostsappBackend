const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const auth_check = require("./api/middlewares/auth_check");
const itemsRoutes = require(`${__dirname}/api/routes/items`);
const usersRoutes = require(`${__dirname}/api/routes/users`)
const messagesRoutes=require(`${__dirname}/api/routes/messages`);


const app = express();
const PORT = process.env.PORT || 3000;
const mongodbURL = `mongodb+srv://e111:${encodeURIComponent(process.env.MONGOPASS)}@cluster0.qd1fh.mongodb.net/itemsgroup?retryWrites=true&w=majority`

mongoose.connect(mongodbURL,(error)=>{
    if(error){
        console.log(error);
    }else{
    console.log("connected to db");}
    
});


app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use("/uploads", express.static(`${__dirname}/uploads`));


app.use("/items", itemsRoutes);
app.use("/users", usersRoutes);
app.use("/messages",auth_check,messagesRoutes);


app.use((req, res, next) => {
    const error = new Error({ message: "NOT FOUND" });
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message });
})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});