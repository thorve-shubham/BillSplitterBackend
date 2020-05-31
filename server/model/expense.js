const mongoose = require('mongoose');
const expenseSchema = mongoose.Schema({
    expenseId : {
        type : String,
        required : true
    },
    groupId : {
        type : String,
        required : true
    },
    expenseName : {
        type : String,
        required : true
    },
    expenseAmount : {
        type : Number,
        required : true
    },
    paidBy : {
        type : mongoose.Schema({
            userId : {
                type : String,
                required : true
            },
            userName : {
                type : String,
                required: true
            }
        }),
        required : true
    },
    members : {
        type : [mongoose.Schema({
            userId : {
                type : String,
                required : true
            },
            userName : {
                type : String,
                required: true
            } 
        })]
    },
    createdOn : {
        type: String,
        required : true
    }
});

const Expense = mongoose.model('expense',expenseSchema);

module.exports.Expense = Expense;
module.exports.expenseSchema = expenseSchema;