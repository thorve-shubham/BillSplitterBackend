const shortId = require('shortid');
const moment = require('moment');

const { User } = require('../model/user');
const isEmpty = require('../libs/checkLib');
const generateResponse = require('../libs/responseLib');
const bcryptLib = require('../libs/bcryptLib');
const winstonLogger = require('../libs/winstonLib');


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
                authToken : token
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

module.exports.createUser = createUser;
module.exports.login = login;