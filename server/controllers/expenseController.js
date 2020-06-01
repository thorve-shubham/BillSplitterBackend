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
        return res.send(generateResponse(404,false,expenses,"Expenses Found"));
    }
}

async function deleteExpense(req,res){
    const expense = await Expense.findOneAndDelete({expenseId : req.body.expenseId});

    if(isEmpty(expense)){
        return res.send(generateResponse(404,true,null,"Expense Not Found"));
    }else{
        return res.send(generateResponse(200,false,null,"Deleted Successfully"));
    }
}

async function getExpenseById(req,res){
    const expense = await Expense.findOne({expenseId : req.body.expenseId});

    if(isEmpty(expense)){
        return res.send(generateResponse(404,true,null,"Expense Not Found"));
    }else{
        return res.send(generateResponse(200,false,expense,"Found Expense"));
    }
}

async function updateExpense(req,res){
    
    const expense = await Expense.findOne({expenseId : req.body.expenseId});

    const paidBy = await User.findOne({userId : req.body.paidBy});

    const members = await User.find({userId : { $in : req.body.members} }).select('userId firstName lastName');

    let msg = "";
    
    for(let x of members){
        console.log(x);
        msg +=x.firstName+" "+x.lastName+"\n";
    }
    console.log(msg);
    let msg1 = req.body.userWhoModified+" Updated Expense : "+req.body.expenseName+" as Follows\n";
    let msg2 = "Expense Amount : from :"+expense.expenseAmount+" to : "+req.body.expenseAmount+"\n";
    let msg3 = "Paid By : From : "+expense.paidBy.userName+" To : "+paidBy.firstName+" "+paidBy.lastName+"\n";
    let msg4 = "Updated Members :\n"+msg;

    if(req.body.expenseAmount != expense.expenseAmount){
        expense.expenseAmount = req.body.expenseAmount;
        msg1+=msg2;
    }
    if(paidBy.userId != expense.paidBy.userId){
        expense.paidBy.userId = paidBy.userId;
        expense.paidBy.userName = paidBy.firstName+" "+paidBy.lastName;
        msg1+=msg3;
    }
    expense.members = [];
    for(let x of members){
        expense.members.push({userId : x.userId, userName : x.firstName+" "+x.lastName});
    }
    msg1+=msg4;

    await expense.save();

    winstonLogger.info("Expense Updated Successfully");
    return res.send(generateResponse(200,false,expense.toObject(),msg1));

}

module.exports.createExpense = createExpense;
module.exports.getByGroupId = getByGroupId;
module.exports.deleteExpense = deleteExpense;
module.exports.getExpenseById = getExpenseById;
module.exports.updateExpense = updateExpense;