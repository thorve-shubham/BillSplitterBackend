
const moment = require('moment');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../model/user');
const isEmpty = require('../libs/checkLib');
const bcryptLib = require('../libs/bcryptLib');
const winstonLogger = require('../libs/winstonLib');

exports.createUser = async (user)=>{
    try{
        let oldUser = await User.find({email : user.email});
        if(!isEmpty(oldUser)){
            winstonLogger.info("User already exists with provided emailId");
            return {
                error : true,
                message : "User already exists with provided emailId"
            }
        }
        user.password = await bcryptLib.generateHashedPassword(user.password);
        let User = new User({
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            password : user.password,
            mobile : user.mobile,
            createdOn : moment()
        });
        await User.save();
        winstonLogger.info("User created Successfully");
        User = User.toObject();
        delete User.password;

        return {
            error : false,
            data : User,
            message : "User created Successfully"
        };
    }catch(error){
        winstonLogger.error("Something went Wrong in Create User");
        return {
            error : true,
            message : "Something went Wrong in Create User"
        }
    }   
}

exports.login = async(email,password)=>{
    const user = await User.findOne({email : email});
    if(!isEmpty(user)){
        if(await bcryptLib.isPasswordRight(password,user.password)){
            const token = user.generateAuthToken();
            winstonLogger.info("User Logged in Successfully");
            let data = {
                _id : user._id,
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                mobile : user.mobile,
                authToken : token
            }
            return {
                error : false,
                data : data,
                message : "User Logged in Successfully"
            }
        }else{
            winstonLogger.info("Invalid Emailid or Password provided");
            return {
                error : true,
                message : "Invalid EmailId or Password"
            }
        }
    }else{
        winstonLogger.info("This EmailId is not registered with BillSplitter");
        return {
            error : true,
            message : "Invalid EmailId or Password"
        }
    }
}

