const { Group } = require('../model/group');
const { User }  = require('../model/user');
const { Expense }= require('../model/expense');

async function retrieveEmails(expense){

    console.log(expense);

    const groupMembers = await Group.findOne({groupId : expense.groupId}).select('members groupName');

    console.log(groupMembers);
 
    let members = []
 
    for(let member of groupMembers.members){
        members.push(member.userId);
    }
 
    const users = await User.find({userId : { $in : members}}).select('email');
 
    let emails = [];
 
    for(let user of users){
        emails.push(user.email);
    }
    return {emails : emails, groupName : groupMembers.groupName};
}

async function retrieveGroupMembers(expenseId,groupId){

    if(expenseId != ""){
        const data = await Expense.findOne({expenseId : expenseId}).select("groupId");
        groupId = data.groupId;
    }

    const group = await Group.findOne({groupId : groupId}).select('members');

    let userIds = [];

    for(let member of group.members){
        userIds.push(member.userId);
    }

    return userIds;
}


module.exports.retrieveEmails = retrieveEmails;
module.exports.retrieveGroupMembers = retrieveGroupMembers;