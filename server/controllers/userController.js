const shortId = require('shortid');
const moment = require('moment');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { User } = require('../model/user');
const isEmpty = require('../libs/checkLib');
const generateResponse = require('../libs/responseLib');
const bcryptLib = require('../libs/bcryptLib');
const winstonLogger = require('../libs/winstonLib');
const url = "http://shubhamthorvetest.in/auth/changePassword/";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubhamthorvefreelance@gmail.com',
      pass: process.env.emailPassword
    }
  });


async function createUser(req,res){

    let oldUser = await User.find({email : req.body.email});
    if(!isEmpty(oldUser)){
        winstonLogger.info("User already exists with provided emailId");
        return res.send(generateResponse(401,true,null,"User with Provided emailId already present"));
    }

    oldUser = await User.find({mobile : req.body.mobile}); 
    if(!isEmpty(oldUser)){
        winstonLogger.info("User already exists with provided mobile no.");
        return res.send(generateResponse(401,true,null,"User with Provided Mobile No. already present"));
    }

    req.body.password = await bcryptLib.generateHashedPassword(req.body.password);
    
    let user = new User({
        userId : shortId.generate(),
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        mobile : req.body.mobile,
        country : req.body.country,
        countryCode : req.body.countryCode,
        createdOn : moment()
    });

    await user.save();

    winstonLogger.info("User created Successfully");

    user = user.toObject();

    delete user.password;

    return res.send(generateResponse(200,false,user,"User Created Successfully"));
        
}

async function login(req,res){
    const user = await User.findOne({email : req.body.email});
    if(!isEmpty(user)){
        if(await bcryptLib.isPasswordRight(req.body.password,user.password)){
            const token = user.generateAuthToken();
            winstonLogger.info("User Logged in Successfully");
            let data = {
                userId : user.userId,
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                mobile : user.mobile,
                authToken : token,
                countryCode : user.countryCode,
                country : user.country
            }
            return res.send(generateResponse(200,false,data,"User Logged In Successfully"));
        }else{
            winstonLogger.info("Invalid Password provided");
        return res.send(generateResponse(401,true,null,"Invalid EmailId or Password"));
        }
    }else{
        winstonLogger.info("This EmailId is not registered with BillSplitter");
        return res.send(generateResponse(404,true,null,"Invalid EmailId or Password"));
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

async function getUsers(req,res){
    const users = await User.find().select('userId firstName lastName');
    if(isEmpty(users)){
        return res.send(generateResponse(404,true,null,"No Users Found"));
    }else{
        return res.send(generateResponse(200,false,users,"Users Found"));
    }
}
module.exports.createUser = createUser;
module.exports.login = login;
module.exports.sendMail = sendMail;
module.exports.changePassword = changePassword;
module.exports.getUsers = getUsers;