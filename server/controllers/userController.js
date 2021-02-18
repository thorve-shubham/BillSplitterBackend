
const moment = require('moment');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../model/user');
const isEmpty = require('../libs/checkLib');
const bcryptLib = require('../libs/bcryptLib');
const winstonLogger = require('../libs/winstonLib');

async function createUser(req,res){

    let oldUser = await User.find({email : req.body.email});
    if(!isEmpty(oldUser)){
        winstonLogger.info("User already exists with provided emailId");
        return res.status(401).send({
            error: true,
            message : "User with Provided emailId already present"
        });
    }

    req.body.password = await bcryptLib.generateHashedPassword(req.body.password);
    
    let user = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        mobile : req.body.mobile,
        createdOn : moment()
    });

    await user.save();

    winstonLogger.info("User created Successfully");

    user = user.toObject();

    delete user.password;

    return res.status(200).send({
        error: false,
        data: user,
        message : "User Created Successfully"
    });
        
}

async function login(req,res){
    const user = await User.findOne({email : req.body.email});
    console.log(req.body);
    console.log(user);
    if(!isEmpty(user)){
        if(await bcryptLib.isPasswordRight(req.body.password,user.password)){
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
            return res.status(200).send({
                error: false,
                message : "User Logged In Successfully",
                data
            });
            
        }else{
            winstonLogger.info("Invalid Password provided");
            return res.status(404).send({
                error: false,
                message : "Invalid EmailId or Password"
            });
        }
    }else{
        winstonLogger.info("This EmailId is not registered with BillSplitter");
        return res.status(404).send({
            error: false,
            message : "Invalid EmailId or Password"
        });
    }
}

async function sendMail(req,res){

    const user = await User.findOne({email : req.body.email});

    if(isEmpty(user)){
        return res.send(generateResponse(404,true,null,"Not Registered With Bill Splitter"));
    }

    const data = {
        userId : user.userId,
        firstName : user.firstName,
        lastName : user.lastName,
        email : user.email,
        mobile : user.mobile
    }

    const authToken = jwt.sign(data,process.env.JWTSECRET,{ expiresIn : '1h'})

    const mailOptions = {
        from: 'shubhamthorvefreelance@gmail.com',
        to: req.body.email,
        subject: 'Forgot Password Link',
        html: "Please find link below to change password<br>"+url+authToken
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          winstonLogger.error("Sending mail failed");
          res.send(generateResponse(403,true,null,"Sending mail failed"));
        } else {
          winstonLogger.info("Mail sent sunccessfully");
          res.send(generateResponse(200,false,null,"Mail sent Successfully"));
        }
    });
}

async function changePassword(req,res){
    const hashedPass = await bcryptLib.generateHashedPassword(req.body.password);
    const user = await User.findOneAndUpdate({userId : req.body.userId,email : req.body.email},
        {
            password : hashedPass
        },{new : true});
    winstonLogger.info("Password Updated Successfully");
    return res.send(generateResponse(200,false,null,"Password Changed Successfully"));
}


module.exports.createUser = createUser;
module.exports.login = login;
module.exports.changePassword = changePassword;
