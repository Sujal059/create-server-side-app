require("dotenv").config();
require("./config/dbConnect");
const express = require('express');
const cors = require('cors');
const usersRoute = require('./routes/users/usersRoutes');
const globalErrHandler = require("./middlewares/globalErrHandler");

const app = express();

//middleware
app.use(express.json()); //pass the incoming data

//cors middleware
app.use(cors());


//Routes---
    //users route
    app.use("/api/v1/users", usersRoute);


//Global Error Handlers
app.use(globalErrHandler);

//Listen to server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server in up and running on port ${PORT}`));