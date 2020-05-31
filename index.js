//node modules
require('dotenv').config();
const config = require('config');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser')

//custom libs
const winstonLogger = require('./server/libs/winstonLib');
const corsLib = require('./server/libs/corsLib');

//importing routes
const users = require('./server/routes/users');
const tokens = require('./server/routes/tokens');
const groups = require('./server/routes/groups');
const expenses = require('./server/routes/expenses');

//loading express
const app = express();

//setting up middlewares
app.use(express.json());
app.use(body_parser.urlencoded({extended:false}));
app.use(corsLib);

//routes
app.use('/user',users);
app.use('/token',tokens);
app.use('/group',groups);
app.use('/expense',expenses);


//DB Connect
mongoose.connect(config.get('mongodbUrl'),{useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology : true})
    .then(()=>{
        winstonLogger.info("Connected To MongoDB");
    })
    .catch((error)=>{
        winstonLogger.error("Something went Wrong : "+error);  
    });

const server = http.createServer(app);

//start Server
server.listen(config.get('Port'),()=>{
    winstonLogger.info("Express server started on port "+config.get('Port'));
});
