const express=require('express');
const connect =require('./database/db');
require("dotenv").config();
const errorMiddleware = require("./middlewares/erroMiddleware");
const loginRouter=require('./Router/loginRoutes');

const cors=require('cors');

const port=4001;
const app=express();
app.use(cors());
app.use(express.json());

app.use('/user',loginRouter);

app.use(errorMiddleware);

connect;
app.listen(port,()=>{
    console.log(`serevr is running at http://localhost:${port}`)
})