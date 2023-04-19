const express=require('express');
const connect =require('./database/db');
require("dotenv").config();
const errorMiddleware = require("./middlewares/erroMiddleware");
const loginRouter=require('./Router/loginRoutes');
const dishRoute = require("./Router/dishRoutes");

const cors=require('cors');

const port=4001;
const app=express();
app.use(cors());
app.use(express.json());

app.use('/user',loginRouter);
app.use("/get",dishRoute);

app.use(errorMiddleware);

connect;
app.listen(port,()=>{
    console.log(`serevr is running at http://localhost:${port}`)
})

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDAzM2Q1NWE2MTJjY2ZmMDUzZjYwOSIsImlhdCI6MTY4MTkzMzEyMiwiZXhwIjoxNjgxOTM0OTIyfQ.pzHCUpCUgkGSjy5Xragsjxjhot5vBnPEX1DbPJzkUUY