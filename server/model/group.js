const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    groupId : {
        type : String,
        required : true
    },
    groupName : {
        type : String,
        required : true
    },
    createdBy : {
        type : mongoose.Schema({
            userId : {
                type : String,
                required : true
            },
            userName : {
                type: String,
                required : true
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
                required : true
            }
        })] ,
        required : true
    },
    createdOn : {
        type : Date,
        required : true
    }
});



const Group = mongoose.model("group",groupSchema);

module.exports.Group = Group;
module.exports.groupSchema = groupSchema;