const isEmpty = require('../libs/checkLib');
const { generateResponse } = require('../libs/responseLib');
const jwt = require('jsonwebtoken');
const winLogger = require("../libs/winstonLib");

module.exports = (req,res,next)=>{
    if(isEmpty(req.body.authToken)){
        winLogger.error("No Token Provided");
        return res.send(generateResponse(404,true,null,"Auth Token Missing"));
    }else{
        try{
            const token = jwt.verify(req.body.authToken,process.env.JWTSECRET);
            winLogger.info("Valid Token Provided");
            next();
        }catch(err){
            winLogger.error("Invalid/ Expired Token Provided");
            return res.send(generateResponse(403,true,null,"Invalid Token Provided"));
        }
    }
}