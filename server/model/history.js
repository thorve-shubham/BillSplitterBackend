const mongoose = require('mongoose');
const historySchema = mongoose.Schema({
    expenseId : {
        type : String,
    },
    groupId : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true 
    },
    createdOn : {
        type : Date,
        required: true
    }
});

const History = mongoose.model('history',historySchema);

module.exports.History = History;
module.exports.historySchema = historySchema;