const isEmpty = require('../libs/checkLib');
const { History } = require('../model/history');
const generateResponse = require('../libs/responseLib');

async function getHistory(req,res){
    const history = await History.find({expenseId : req.body.expenseId}).sort({ createdOn : -1}).skip(req.body.pageNo*3).limit(3);

    if(isEmpty(history)){
        return res.send(generateResponse(404,true,null,"NO History Present"));
    }else{
        return res.send(generateResponse(404,false,history,"History Present"));
    }
}

module.exports.getHistory = getHistory;