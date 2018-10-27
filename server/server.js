const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* Database connectivity */
const dburl = "mongodb://127.0.0.1/uid";
mongoose
    .connect(dburl, { useNewUrlParser: true }, (err, db) =>{
        if(err){
            console.log(err);
            console.log("Database Connectivity Error!!");
        } else {
            console.log("Database Connectivity Successfull!");
        }
    });
mongoose.Promise = global.Promise;

/* Middlewares */
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// handling cors errors
app.use(cors());
app.use(express.static('../public'));
/* routes */
var routes = require('./routes/routes.js');
app.use('/api',routes);

/* Error handling for route which was not defined elsewhere */
app.use((res, req, next) => {
    const error = new Error("Page not found!!");
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.send(error.message);
});

app.listen(3000, function(){
    console.log(`Server running on 3000.`);
});
