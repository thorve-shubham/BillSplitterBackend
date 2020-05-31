const { Expense } = require('../model/expense');
const shortId = require('shortid');
const { User } = require('../model/user');
const winstonLogger = require('../libs/winstonLib');
const generateResponse = require('../libs/responseLib');
const isEmpty = require('../libs/checkLib');

async function createExpense(req,res){

    const paidByUser = await User.findOne({userId : req.body.paidBy}).select('userId firstName lastName');

    const membersdb = await User.find({userId : { $in : req.body.members}}).select('userId firstName lastName')

   let expense = new Expense({
       expenseId : shortId.generate(),
       groupId : req.body.groupId,
       expenseName : req.body.expenseName,
       expenseAmount : req.body.expenseAmount,
       paidBy : {
           userId : paidByUser.userId,
           userName : paidByUser.firstName+" "+paidByUser.lastName
       },
       createdOn : new Date()
   }); 

   for(x of membersdb){
       expense.members.push({userId : x.userId,userName : x.firstName+" "+x.lastName});
   }

   await expense.save();
   winstonLogger.info("Expense Created Successfully");
   return res.send(generateResponse(200,false,null,"Expense Created Successfully"));
}

async function getByGroupId(req,res){
    const expenses = await Expense.find({groupId : req.body.groupId});
    if(isEmpty(expenses)){
        return res.send(generateResponse(404,true,null,"No Expenses Found for this Group"));
    }else{
        return res.send(generateResponse(404,true,expenses,"Expenses Found"));
    }
}

module.exports.createExpense = createExpense;
module.exports.getByGroupId = getByGroupId;